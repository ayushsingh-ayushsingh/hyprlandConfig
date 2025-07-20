'use client';

import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link"><Menu /></Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
const LOCAL_STORAGE_KEY = 'plate-content';

// This is the default content if nothing is found in localStorage
const defaultValue = [
  {
    type: 'p',
    children: [{ text: 'Hello, world! Start typing...' }],
  },
];

export default function EditorDefault() {
  // 1. Initialize state from localStorage or use the default value.
  // This function only runs on the initial render.
  const [value, setValue] = useState(() => {
    // Check if we are in a browser environment
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const savedContent = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      // If there's saved content, parse and return it. Otherwise, return the default.
      return savedContent ? JSON.parse(savedContent) : defaultValue;
    } catch (error) {
      // If parsing fails, fall back to the default value
      console.error("Error parsing content from localStorage", error);
      return defaultValue;
    }
  });

  // 2. Configure the editor to save changes to state and localStorage.
  const editor = usePlateEditor({
    plugins: EditorKit,
    // The `onChange` handler is the key to saving data.
    onChange: (newValue) => {
      // Update the React state with the new content
      setValue(newValue);

      // Save the new content to localStorage
      const contentString = JSON.stringify(newValue);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, contentString);
    },
  });

  return (
    // 3. Pass the managed `value` state to the Plate component.
    <Plate editor={editor} value={value}>
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
          <SheetDemo />
        </div>
      </div>
    </Plate>
  );
}