import React, { useState } from "react";
import axios from "axios";
import "../../../../App.css";
import { Avatar, Button, Collapse, Input, Spin } from "antd";
import DashboardViewModel from "../viewmodel/dashboardViewModel";

const { Panel } = Collapse;

interface User {
  login: string;
  id: number;
  avatar_url: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
}

const DashboardView: React.FC = () => {
  const ViewModel = DashboardViewModel();
  return (
    <div className="app-container">
      <Input
        placeholder="Enter Username"
        value={ViewModel.userSearched}
        onChange={(e) => ViewModel.setUserSearched(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        onClick={ViewModel.searchUsers}
        style={{ borderRadius: 0, width: "100%" }}
      >
        {ViewModel.loading ? <Spin size="small" /> : "Search"}
      </Button>

      {ViewModel.error && <p style={{ color: "red" }}>{ViewModel.error}</p>}
      {ViewModel.users.length > 0 && (
        <>
          <p>Showing users for "{ViewModel.username}"</p>
          <Collapse onChange={ViewModel.handleCollapseChange}>
            {ViewModel.users.map((user) => (
              <Panel
                header={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={user.avatar_url}
                      size={30}
                      style={{ marginRight: 10 }}
                    />
                    {user.login}
                  </div>
                }
                key={user.id.toString()}
              >
                {ViewModel.loading ? (
                  <Spin />
                ) : (
                  <ul>
                    {ViewModel.repositories[user.id]?.map((repo) => (
                      <li
                        key={repo.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {repo.name}
                          </a>
                          <p>
                            {repo.description || "No description available"}
                          </p>
                        </div>
                        <label
                          style={{ whiteSpace: "nowrap", marginLeft: "10px" }}
                        >
                          {repo.stargazers_count} ★
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            ))}
          </Collapse>
        </>
      )}
    </div>
  );
};

export default DashboardView;
