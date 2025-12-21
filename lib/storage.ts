// lib/storage.ts

import { StarredCourse, SearchHistory } from './types';

const STARRED_KEY = 'focusedu_starred_courses';
const HISTORY_KEY = 'focusedu_search_history';
const MAX_HISTORY = 5;

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Starred Courses Management
export const getStarredCourses = (): StarredCourse[] => {
  if (!isBrowser) return [];
  try {
    const stored = localStorage.getItem(STARRED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading starred courses:', error);
    return [];
  }
};

export const addStarredCourse = (course: StarredCourse): void => {
  if (!isBrowser) return;
  try {
    const starred = getStarredCourses();
    const exists = starred.find(c => c.id === course.id && c.type === course.type);
    
    if (!exists) {
      starred.unshift({ ...course, starredAt: Date.now() });
      localStorage.setItem(STARRED_KEY, JSON.stringify(starred));
    }
  } catch (error) {
    console.error('Error adding starred course:', error);
  }
};

export const removeStarredCourse = (id: string, type: 'youtube' | 'udemy'): void => {
  if (!isBrowser) return;
  try {
    const starred = getStarredCourses();
    const filtered = starred.filter(c => !(c.id === id && c.type === type));
    localStorage.setItem(STARRED_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing starred course:', error);
  }
};

export const isCoursStarred = (id: string, type: 'youtube' | 'udemy'): boolean => {
  if (!isBrowser) return false;
  const starred = getStarredCourses();
  return starred.some(c => c.id === id && c.type === type);
};

// Search History Management
export const getSearchHistory = (): SearchHistory[] => {
  if (!isBrowser) return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

export const addToHistory = (topic: string, skillLevel: 'beginner' | 'intermediate' | 'advanced'): void => {
  if (!isBrowser) return;
  try {
    let history = getSearchHistory();
    
    // Remove duplicate if exists
    history = history.filter(h => h.topic.toLowerCase() !== topic.toLowerCase());
    
    // Add new entry at the beginning
    history.unshift({
      topic,
      skillLevel,
      timestamp: Date.now()
    });
    
    // Keep only last MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};

export const clearHistory = (): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};