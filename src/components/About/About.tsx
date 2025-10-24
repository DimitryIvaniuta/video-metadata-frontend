import React from "react";
import pkg from "../../../package.json"; // vite/webpack can import json by default
import "./About.scss";

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="col-12 col-md-6 col-lg-3 mb-3">
        <div className="about-stat card h-100">
            <div className="card-body">
                <div className="about-stat-label">{label}</div>
                <div className="about-stat-value">{value}</div>
            </div>
        </div>
    </div>
);

const About = () => {
    const version = (pkg as any)?.version ?? "0.0.0";
    const env = import.meta?.env?.MODE ?? process.env.NODE_ENV ?? "development";

    return (
        <div className="container py-4 py-lg-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-lg-5">
                            <h1 className="h3 mb-3">About VideoMeta</h1>
                            <p className="text-muted mb-4">
                                VideoMeta is a demo platform for uploading, organizing, and inspecting video metadata.
                                It showcases a modern stack: React + Apollo Client on the frontend and Spring WebFlux + GraphQL on the backend.
                            </p>

                            <div className="row">
                                <Stat label="App Version" value={version} />
                                <Stat label="Environment" value={env} />
                                <Stat label="Frontend" value="React, Apollo, Bootstrap" />
                                <Stat label="Backend" value="Spring WebFlux, GraphQL" />
                            </div>

                            <hr className="my-4" />

                            <h2 className="h5 mb-3">Key Features</h2>
                            <ul className="mb-4">
                                <li>JWT auth with refresh token rotation (HttpOnly cookie).</li>
                                <li>GraphQL queries for Users and FX rates (live/convert) with resilient fallbacks.</li>
                                <li>Currency Converter with debounced requests and loading indicators.</li>
                                <li>Responsive UI using Bootstrap utilities and custom SCSS polish.</li>
                            </ul>

                            <h2 className="h5 mb-3">Useful Links</h2>
                            <ul className="mb-0">
                                <li>
                                    <a href="/" className="link-primary text-decoration-none">Dashboard</a>
                                </li>
                                <li>
                                    <a href="/videos" className="link-primary text-decoration-none">Videos</a>
                                </li>
                                <li>
                                    <a href="/videos/import" className="link-primary text-decoration-none">Import</a>
                                </li>
                                <li>
                                    <a href="/users" className="link-primary text-decoration-none">Users</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center text-muted small mt-3">
                        © {new Date().getFullYear()} VideoMeta
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
