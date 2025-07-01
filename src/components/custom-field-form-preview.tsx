'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { FormData } from './custom-field-builder';

interface FormPreviewProps {
    form: FormData;
}

export default function CustomFieldFormBuilderPreview({
    form,
}: FormPreviewProps) {
    const sortedQuestions = [...form.questions].sort(
        (a, b) => a.order - b.order,
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    {/* <CardTitle>{form.title || "Untitled Form"}</CardTitle>
          {form.description && (
            <CardDescription>{form.description}</CardDescription>
          )} */}
                </CardHeader>
            </Card>

            {sortedQuestions.map((question, qIdx) => (
                <Card key={qIdx}>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <p className="font-medium">
                                    {question.title}
                                    {question.required && (
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    )}
                                </p>
                            </div>

                            {question.type === 'multiple_choice' && (
                                <RadioGroup>
                                    {question.options.map((option, oIdx) => (
                                        <div
                                            key={oIdx}
                                            className="flex items-center space-x-2"
                                        >
                                            <RadioGroupItem
                                                value={String(oIdx)}
                                                id={`q${qIdx}o${oIdx}`}
                                            />
                                            <Label htmlFor={`q${qIdx}o${oIdx}`}>
                                                {option.value}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}

                            {question.type === 'checkbox' && (
                                <div className="space-y-2">
                                    {question.options.map((option, oIdx) => (
                                        <div
                                            key={oIdx}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox id={`q${qIdx}o${oIdx}`} />
                                            <Label htmlFor={`q${qIdx}o${oIdx}`}>
                                                {option.value}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {question.type === 'dropdown' && (
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {question.options.map(
                                            (option, oIdx) => (
                                                <SelectItem
                                                    key={oIdx}
                                                    value={String(oIdx)}
                                                >
                                                    {option.value}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            )}

                            {question.type === 'short_answer' && (
                                <Input placeholder="Your answer" />
                            )}

                            {question.type === 'paragraph' && (
                                <Textarea
                                    placeholder="Your answer"
                                    className="min-h-[100px]"
                                />
                            )}

                            {question.type === 'file_upload' && (
                                <div className="space-y-2">
                                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg
                                                className="h-10 w-10 text-gray-400"
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
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Click to upload or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOC, DOCX up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Input type="file" className="hidden" />
                                </div>
                            )}

                            {question.type === 'date' && (
                                <Input type="date" placeholder="Select date" />
                            )}

                            {question.type === 'date_range' && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-sm text-gray-600">
                                                From Date
                                            </Label>
                                            <Input
                                                type="date"
                                                placeholder="Start date"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm text-gray-600">
                                                To Date
                                            </Label>
                                            <Input
                                                type="date"
                                                placeholder="End date"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
