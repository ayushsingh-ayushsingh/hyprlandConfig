'use client';

import { useState } from 'react';
// Import the `Value` type for type safety
import { Plate, usePlateEditor, Value } from 'platejs/react';
import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { MenuSheet } from './components/ui/menu-sheet';

const LOCAL_STORAGE_KEY = 'plate-content';

// The default content if nothing is saved in localStorage
const defaultValue: Value = [
  {
    type: 'h1',
    children: [{ text: 'An Advanced Content Demo' }],
  },
  {
    type: 'p',
    children: [
      { text: 'This document demonstrates how to render complex content like lists, images, and tables using Plate. Here is some ' },
      { text: 'bold text', bold: true },
      { text: ', some ' },
      { text: 'italic text', italic: true },
      { text: ', and some ' },
      { text: 'code', code: true },
      { text: '.' },
    ],
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ type: 'p', children: [{ text: 'First bullet point.' }] }],
      },
      {
        type: 'li',
        children: [{ type: 'p', children: [{ text: 'Second bullet point.' }] }],
      },
    ],
  },
  {
    type: 'p',
    children: [{ text: 'Now for an image:' }],
  },
  {
    type: 'img',
    url: 'https://source.unsplash.com/random/800x600',
    children: [{ text: '' }],
    width: '75%',
  },
  {
    type: 'caption',
    children: [{ text: 'A random image from Unsplash.' }],
    align: 'center',
  },
  {
    type: 'p',
    children: [{ text: 'And finally, a table:' }],
  },
  {
    type: 'table',
    children: [
      {
        type: 'tr',
        children: [
          {
            type: 'th',
            children: [{ type: 'p', children: [{ text: 'Header 1' }] }],
          },
          {
            type: 'th',
            children: [{ type: 'p', children: [{ text: 'Header 2' }] }],
          },
        ],
      },
      {
        type: 'tr',
        children: [
          {
            type: 'td',
            children: [{ type: 'p', children: [{ text: 'Cell A1' }] }],
          },
          {
            type: 'td',
            children: [{ type: 'p', children: [{ text: 'Cell B1' }] }],
          },
        ],
      },
    ],
  },
];

export default function EditorDefault() {
  const [value, setValue] = useState<Value>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const savedContent = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedContent ? JSON.parse(savedContent) : defaultValue;
    } catch (error) {
      console.error("Error parsing content from localStorage:", error);
      return defaultValue;
    }
  });
  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  return (
    <Plate
      editor={editor}
      value={value}
      onChange={(newValue: Value) => {
        setValue(newValue);

        const contentString = JSON.stringify(newValue);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, contentString);
      }}
    >
      <EditorContainer>
        <div className="flex flex-col items-center w-full">
          <Editor
            className="pt-[20vh] min-h-[80vh]"
            spellCheck={false}
          />
        </div>
      </EditorContainer>
      <div className="mt-4 fixed bottom-2 right-2">
        <div className='flex gap-2'>
          <MenuSheet />
        </div>
      </div>
    </Plate>
  );
}