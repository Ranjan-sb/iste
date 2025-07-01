'use client';

import type React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { Question, QuestionType } from './custom-field-builder';

interface QuestionCardProps {
    question: Question;
    onUpdate: (question: Question) => void;
    onDelete: (order: number) => void;
}

export default function CustomFieldQuestionCard({
    question,
    onUpdate,
    onDelete,
}: QuestionCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: question.order, data: { order: question.order } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({
            ...question,
            title: e.target.value,
        });
    };

    const handleTypeChange = (value: string) => {
        const newType = value as QuestionType;
        let newOptions = question.options;

        if (
            (newType === 'short_answer' ||
                newType === 'paragraph' ||
                newType === 'file_upload') &&
            question.options.length > 0
        ) {
            newOptions = [];
        } else if (
            (newType === 'multiple_choice' ||
                newType === 'checkbox' ||
                newType === 'dropdown') &&
            question.options.length === 0
        ) {
            newOptions = [{ value: 'Option 1' }, { value: 'Option 2' }];
        }

        onUpdate({
            ...question,
            type: newType,
            options: newOptions,
        });
    };

    const handleRequiredChange = (checked: boolean) => {
        onUpdate({
            ...question,
            required: checked,
        });
    };

    const handleOptionChange = (optionIdx: number, value: string) => {
        onUpdate({
            ...question,
            options: question.options.map((opt, idx) =>
                idx === optionIdx ? { ...opt, value } : opt,
            ),
        });
    };

    const addOption = () => {
        onUpdate({
            ...question,
            options: [
                ...question.options,
                { value: `Option ${question.options.length + 1}` },
            ],
        });
    };

    const removeOption = (optionIdx: number) => {
        if (question.options.length <= 1) return;

        onUpdate({
            ...question,
            options: question.options.filter((_, idx) => idx !== optionIdx),
        });
    };

    return (
        <Card ref={setNodeRef} style={style} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <div className="flex items-center gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <GripVertical className="size-5 text-gray-400" />
                    </div>
                    <Select
                        value={question.type}
                        onValueChange={handleTypeChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Question Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="multiple_choice">
                                Multiple Choice
                            </SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="dropdown">Dropdown</SelectItem>
                            <SelectItem value="short_answer">
                                Short Answer
                            </SelectItem>
                            <SelectItem value="paragraph">Paragraph</SelectItem>
                            <SelectItem value="file_upload">
                                File Upload
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(question.order)}
                        title="Delete question"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <Input
                        value={question.title}
                        onChange={handleTitleChange}
                        placeholder="Question text"
                        className="text-lg font-medium"
                    />

                    {/* Options for multiple choice, checkbox, and dropdown */}
                    {(question.type === 'multiple_choice' ||
                        question.type === 'checkbox' ||
                        question.type === 'dropdown') && (
                        <div className="space-y-2">
                            {question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex w-6 justify-center">
                                        {question.type ===
                                            'multiple_choice' && (
                                            <div className="mt-1 size-4 rounded-full border border-gray-300" />
                                        )}
                                        {question.type === 'checkbox' && (
                                            <div className="mt-1 size-4 rounded border border-gray-300" />
                                        )}
                                        {question.type === 'dropdown' && (
                                            <span className="mt-1 text-sm text-gray-500">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        value={option.value}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                idx,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Option text"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(idx)}
                                        disabled={question.options.length <= 1}
                                        className="size-8"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                                className="mt-2"
                            >
                                <Plus className="mr-2 size-4" />
                                Add Option
                            </Button>
                        </div>
                    )}

                    {/* Preview for short answer and paragraph */}
                    {question.type === 'short_answer' && (
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                Short answer text field
                            </p>
                        </div>
                    )}

                    {question.type === 'paragraph' && (
                        <div className="h-24 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                Paragraph text field
                            </p>
                        </div>
                    )}

                    {question.type === 'file_upload' && (
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="rounded border border-dashed border-gray-300 p-4 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg
                                            className="h-8 w-8 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                            File upload area
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                        <Switch
                            checked={question.required}
                            onCheckedChange={handleRequiredChange}
                        />
                        <Label>Required</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
