'use client';

import { useEffect, useState } from 'react';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { set } from 'lodash';
import { Eye, Plus, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CustomFieldFormBuilderPreview from './custom-field-form-preview';
import CustomFieldQuestionCard from './custom-field-question-card';

export type QuestionType =
    | 'multiple_choice'
    | 'checkbox'
    | 'dropdown'
    | 'short_answer'
    | 'paragraph'
    | 'file_upload'
    | 'date'
    | 'date_range';

export interface Option {
    value: string;
}

export interface Question {
    type: QuestionType;
    title: string;
    required: boolean;
    options: Option[];
    order: number;
}

export interface FormData {
    questions: Question[];
}

interface CustomFieldFormBuilderProps {
    value?: Question[];
    onChange?: (questions: Question[]) => void;
}

export default function CustomFieldFormBuilder({
    value,
    onChange,
}: CustomFieldFormBuilderProps) {
    const [form, setForm] = useState<FormData>(
        value
            ? { questions: value }
            : {
                  questions: [
                      {
                          type: 'multiple_choice',
                          title: 'Untitled Question',
                          required: false,
                          options: [
                              { value: 'Option 1' },
                              { value: 'Option 2' },
                          ],
                          order: 0,
                      },
                  ],
              },
    );

    useEffect(() => {
        if (value && JSON.stringify(value) !== JSON.stringify(form.questions))
            setForm({ questions: value });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (onChange) onChange(form.questions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    const [activeTab, setActiveTab] = useState('edit');
    const [addFieldOpen, setAddFieldOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            type,
            title: 'Untitled Question',
            required: false,
            options:
                type === 'short_answer' ||
                type === 'paragraph' ||
                type === 'file_upload' ||
                type === 'date' ||
                type === 'date_range'
                    ? []
                    : [{ value: 'Option 1' }, { value: 'Option 2' }],
            order: form.questions.length,
        };

        setForm({
            ...form,
            questions: [...form.questions, newQuestion],
        });
    };

    const updateQuestion = (updatedQuestion: Question) => {
        setForm({
            ...form,
            questions: form.questions.map((q, idx) =>
                idx === updatedQuestion.order ? updatedQuestion : q,
            ),
        });
    };

    const deleteQuestion = (questionOrder: number) => {
        setForm({
            ...form,
            questions: form.questions
                .filter((q) => q.order !== questionOrder)
                .map((q, index) => ({ ...q, order: index })),
        });
    };

    const duplicateQuestion = (questionOrder: number) => {
        const questionToDuplicate = form.questions.find(
            (q) => q.order === questionOrder,
        );
        if (!questionToDuplicate) return;

        const duplicatedQuestion: Question = {
            ...questionToDuplicate,
            title: `${questionToDuplicate.title} (Copy)`,
            options: questionToDuplicate.options.map((opt) => ({
                value: opt.value,
            })),
            order: form.questions.length,
        };

        setForm({
            ...form,
            questions: [...form.questions, duplicatedQuestion],
        });
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.data.current.order !== over.data.current.order) {
            const oldIndex = active.data.current.order;
            const newIndex = over.data.current.order;

            const newQuestions = [...form.questions];
            const [movedItem] = newQuestions.splice(oldIndex, 1);
            newQuestions.splice(newIndex, 0, movedItem);

            const updatedQuestions = newQuestions.map((q, index) => ({
                ...q,
                order: index,
            }));

            setForm({
                ...form,
                questions: updatedQuestions,
            });
        }
    };

    const handleAddField = (type: QuestionType) => {
        addQuestion(type);
        setAddFieldOpen(false);
    };

    return (
        <div className="w-full">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="mb-6 grid w-full grid-cols-2">
                    <TabsTrigger
                        value="edit"
                        className="flex items-center gap-2"
                    >
                        <Settings className="size-4" />
                        Edit Form
                    </TabsTrigger>
                    <TabsTrigger
                        value="preview"
                        className="flex items-center gap-2"
                    >
                        <Eye className="size-4" />
                        Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="w-full space-y-4">
                    <div className="w-full">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={form.questions.map((q) => q.order)}
                                strategy={verticalListSortingStrategy}
                            >
                                {form.questions.map((question) => (
                                    <div
                                        key={question.order}
                                        className="w-full"
                                    >
                                        <CustomFieldQuestionCard
                                            question={question}
                                            onUpdate={updateQuestion}
                                            onDelete={deleteQuestion}
                                        />
                                    </div>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>

                    <div className="w-full">
                        <div className="border-primary/40 mb-2 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4">
                            {!addFieldOpen ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setAddFieldOpen(true)}
                                    className="flex w-full items-center justify-center gap-2 py-6 text-base font-semibold"
                                >
                                    <Plus className="size-5" />
                                    Add Field
                                </Button>
                            ) : (
                                <div className="flex w-full flex-col gap-3">
                                    <Select
                                        onValueChange={(val) => {
                                            addQuestion(val as QuestionType);
                                            setAddFieldOpen(false);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select field type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="multiple_choice">
                                                Multiple Choice
                                            </SelectItem>
                                            <SelectItem value="checkbox">
                                                Checkbox
                                            </SelectItem>
                                            <SelectItem value="dropdown">
                                                Dropdown
                                            </SelectItem>
                                            <SelectItem value="short_answer">
                                                Short Answer
                                            </SelectItem>
                                            <SelectItem value="paragraph">
                                                Paragraph
                                            </SelectItem>
                                            <SelectItem value="file_upload">
                                                File Upload
                                            </SelectItem>
                                            <SelectItem value="date">
                                                Date
                                            </SelectItem>
                                            <SelectItem value="date_range">
                                                Date Range
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="preview" className="w-full">
                    <CustomFieldFormBuilderPreview form={form} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
