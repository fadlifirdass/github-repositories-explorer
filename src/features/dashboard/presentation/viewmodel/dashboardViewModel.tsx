import { useState } from "react";
import axios from "axios";

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

export default function DashboardViewModel() {
  const [username, setUsername] = useState<string>(""); 
  const [userSearched, setUserSearched] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [repositories, setRepositories] = useState<{ [key: number]: Repository[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  const searchUsers = async () => {
    if (!userSearched.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${userSearched} in:login`
      );
      const fetchedUsers = response.data.items.slice(0, 3);
      
      setUsers(fetchedUsers);

      if (fetchedUsers.length === 0) {
        setError("Data not found");
      } else {
        setUsername(userSearched); 
      }
    } catch (err) {
      setError("Error fetching users from GitHub");
    } finally {
      setLoading(false);
    }
  };

 
  const fetchRepositories = async (userId: number, login: string) => {
    if (repositories[userId]) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.github.com/users/${login}/repos`
      );
      setRepositories((prev) => ({
        ...prev,
        [userId]: response.data.slice(0, 3),
      }));
    } catch (err) {
      setError("Error fetching repositories from GitHub");
    } finally {
      setLoading(false);
    }
  };

  const handleCollapseChange = (activeKeys: string | string[]) => {
    if (Array.isArray(activeKeys)) {
      activeKeys.forEach((key) => {
        const user = users.find((u) => u.id.toString() === key);
        if (user) {
          fetchRepositories(user.id, user.login);
        }
      });
    }
  };

  return {
    searchUsers,
    handleCollapseChange,
    fetchRepositories,
    username,
    setUsername,
    userSearched,
    setUserSearched,
    repositories,
    setRepositories,
    loading,
    setLoading,
    error,
    setError,
    users,
  };
}
