"use client";

import { User } from "@/types";

// Cookie names
export const USER_ID_COOKIE = "user_id";

// Set a cookie with a given name and value
export const setCookie = (
  name: string,
  value: string,
  days: number = 30
): void => {
  if (typeof window === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

// Get a cookie value by name
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }

  return null;
};

// Delete a cookie by name
export const deleteCookie = (name: string): void => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
};

// Set the user ID in a cookie
export const setUserIdCookie = (userId: string): void => {
  setCookie(USER_ID_COOKIE, userId);
};

// Get the user ID from the cookie
export const getUserIdFromCookie = (): string | null => {
  return getCookie(USER_ID_COOKIE);
};

// Mock user data for development
export const getMockUsers = (): User[] => {
  return [
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      createdAt: new Date(2023, 0, 15).toISOString(),
      preferences: {
        theme: "light",
        emailNotifications: true,
      },
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      createdAt: new Date(2023, 2, 10).toISOString(),
      preferences: {
        theme: "dark",
        emailNotifications: false,
      },
    },
    {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "user",
      createdAt: new Date(2023, 5, 22).toISOString(),
    },
  ];
};

// Get a mock user by ID
export const getMockUserById = (userId: string): User | undefined => {
  return getMockUsers().find((user) => user.id === userId);
};

// Get the current user from the cookie
export const getCurrentUser = (): User | undefined => {
  const userId = getUserIdFromCookie();
  if (!userId) return undefined;

  return getMockUserById(userId);
};
