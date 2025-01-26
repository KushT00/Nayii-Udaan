"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

export default function LanguageTranslationComponent() {
  useEffect(() => {
    // Add global function for Google Translate
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {pageLanguage: 'en'},
        'google_translate_element'
      );
    };
  }, []);

  return (
    <>
      {/* Google Translate Script */}
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        
      />

      {/* Google Translate Element */}
      <div id="google_translate_element" className="mb-4">
        Language Translation
      </div>
    </>
  );
}