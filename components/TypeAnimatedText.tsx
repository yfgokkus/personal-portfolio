"use client";

import { useTypeAnimatedText } from "./hooks/useTypeAnimatedText";

type TypingTextProps = {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  pauseAfterDelete?: number;
};

export default function TypeAnimatedText({
  texts,
  typingSpeed,
  deletingSpeed,
  pauseDuration,
  pauseAfterDelete,
}: TypingTextProps) {
  const text = useTypeAnimatedText({
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    pauseAfterDelete,
  });

  return (
    <span>
      {text}
      <span className="ml-1 animate-pulse">|</span>
    </span>
  );
}
