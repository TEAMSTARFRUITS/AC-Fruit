import React, { createContext, useContext, useState } from 'react';
import { useAppearanceStore } from '../store/appearanceStore';

interface AppearanceContextType {
  headerImage: string;
  headerVideo: string;
  useVideo: boolean;
  headerTitle: string;
  headerSubtitle: string;
  logo: string;
  categoryImages: Record<string, string>;
  categoryIcons: Record<string, string>;
  homepageBanner: string;
  updateAppearance: (
    headerImage: string, 
    headerVideo: string,
    useVideo: boolean,
    headerTitle: string,
    headerSubtitle: string,
    logo: string, 
    categoryImages: Record<string, string>,
    categoryIcons: Record<string, string>,
    homepageBanner: string
  ) => void;
}

const AppearanceContext = createContext<AppearanceContextType | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { appearance, updateAppearance: updateStore } = useAppearanceStore();

  const updateAppearance = (
    headerImage: string,
    headerVideo: string,
    useVideo: boolean,
    headerTitle: string,
    headerSubtitle: string,
    logo: string,
    categoryImages: Record<string, string>,
    categoryIcons: Record<string, string>,
    homepageBanner: string
  ) => {
    updateStore({
      headerImage,
      headerVideo,
      useVideo,
      headerTitle,
      headerSubtitle,
      logo,
      categoryImages,
      categoryIcons,
      homepageBanner
    });
  };

  const value = {
    headerImage: appearance.headerImage,
    headerVideo: appearance.headerVideo,
    useVideo: appearance.useVideo,
    headerTitle: appearance.headerTitle,
    headerSubtitle: appearance.headerSubtitle,
    logo: appearance.logo,
    categoryImages: appearance.categoryImages,
    categoryIcons: appearance.categoryIcons,
    homepageBanner: appearance.homepageBanner,
    updateAppearance
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}