#include <iostream>
#include <fstream>
#include <unordered_map>
#include <string>
#include <random>
#include <mutex>
#include <sstream>
#include "httplib.h"
#include "nlohmann/json.hpp"

using json = nlohmann::json;
using namespace httplib;

const std::string DB_FILE = "/Users/Vatspratapsingh/Desktop/projects/url-shortener/backend/db.txt";
std::mutex db_mutex;

bool is_valid_url(const std::string& url) {
    return url.rfind("http://", 0) == 0 || url.rfind("https://", 0) == 0;
}

std::string generate_short_id(size_t length = 6) {
    const std::string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(0, chars.size() - 1);
    std::string id;
    for (size_t i = 0; i < length; ++i) {
        id += chars[distrib(gen)];
    }
    return id;
}

std::unordered_map<std::string, std::string> load_database() {
    std::lock_guard<std::mutex> lock(db_mutex);
    std::unordered_map<std::string, std::string> db;
    std::ifstream file(DB_FILE);
    std::string line;
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string short_id;
        if (iss >> short_id) {
            std::string rest_of_line;
            std::getline(iss, rest_of_line);
            rest_of_line.erase(0, rest_of_line.find_first_not_of(" \t"));
            db[short_id] = rest_of_line;
        }
    }
    return db;
}

void save_to_database(const std::string& short_id, const std::string& long_url) {
    std::lock_guard<std::mutex> lock(db_mutex);
    std::ofstream file(DB_FILE, std::ios::app);
    if (!file) {
        std::cerr << "❌ Failed to open DB file for writing\n";
        return;
    }
    std::cout << "💾 Appending to DB: " << short_id << " => " << long_url << std::endl;
    file << short_id << " " << long_url << std::endl;
}

int main() {
    Server svr;

    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"},
    });

    svr.Options(R"(/.*)", [](const Request&, Response& res) {
        res.status = 204;
    });

    svr.Post("/shorten", [](const Request& req, Response& res) {
        try {
            auto body = json::parse(req.body);

            if (!body.contains("long_url") || !body["long_url"].is_string()) {
                res.status = 400;
                res.set_content(R"({"error":"Missing or invalid long_url"})", "application/json");
                return;
            }

            std::string long_url = body["long_url"];
            if (long_url.find("localhost:3000/s/") != std::string::npos) {
                res.status = 400;
                res.set_content(R"({"error":"You cannot shorten a short URL"})", "application/json");
                return;
            }
            if (!is_valid_url(long_url)) {
                res.status = 400;
                res.set_content(R"({"error":"Invalid long_url"})", "application/json");
                return;
            }

            auto db = load_database();

            for (const auto& pair : db) {
                if (pair.second == long_url) {
                    json response = {
                        {"id", pair.first},
                        {"original", long_url},
                        {"short_url", "http://localhost:3000/s/" + pair.first}
                    };
                    res.status = 200;
                    res.set_content(response.dump(), "application/json");
                    return;
                }
            }

            std::string short_id;
            do {
                short_id = generate_short_id();
            } while (db.count(short_id));

            save_to_database(short_id, long_url);
            std::cout << "💾 Saved: " << short_id << " => " << long_url << std::endl;
            db = load_database();  // Reload the DB to reflect the latest entry

            json response = {
                {"id", short_id},
                {"original", long_url},
                {"short_url", "http://localhost:3000/s/" + short_id}
            };

            res.status = 200;
            res.set_content(response.dump(), "application/json");

        } catch (...) {
            res.status = 500;
            res.set_content(R"({"error":"Server error"})", "application/json");
        }
    });

    svr.Get("/resolve", [](const Request& req, Response& res) {
        auto short_id = req.get_param_value("id");
        std::cout << "🧩 Looking for short_id: " << short_id << std::endl;
        auto db = load_database();
        if (db.find(short_id) != db.end()) {
            json response = {
                {"original_url", db[short_id]}
            };
            res.status = 200;
            res.set_content(response.dump(), "application/json");
        } else {
            res.status = 404;
            res.set_content(R"({"error":"Short ID not found"})", "application/json");
        }
    });

    std::cout << "🚀 Server started on port 18080..." << std::endl;
    svr.listen("0.0.0.0", 18080);
    return 0;
}