import AppLayout from '@/layouts/app-layout';
import { Head, Form, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useRef, useState } from 'react';

export default function CreateEvent({ organiser }: { organiser: any }) {
    const { flash } = usePage().props as any;
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
        <AppLayout>
            <Head title="Create Event" />

            <div className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl">
                    <div className="rounded-lg bg-white p-6 shadow-md border border-gray-300">
                        <div className="mb-4 pb-3 border-b border-gray-300">
                            <h2 className="text-xl font-semibold">Create Event</h2>
                        </div>

                        {flash?.success && (
                            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                                {flash.success}
                            </div>
                        )}

                        <Form method="post" action="/events" encType="multipart/form-data" className="space-y-4">
                            <input type="hidden" name="organiser_id" value={organiser?.id ?? ''} />
                            <input type="hidden" name="StartDate" value={startDate ? startDate.toISOString() : ''} />
                            <input type="hidden" name="EndDate" value={endDate ? endDate.toISOString() : ''} />

                            <div>
                                <Label htmlFor="Title">Event Name</Label>
                                <Input id="Title" name="Title" required />
                            </div>

                            <div>
                                <Label htmlFor="Description">Description</Label>
                                <Textarea id="Description" name="Description" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="StartDate">Event Start Date</Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="Pp"
                                        className="w-full rounded-md border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="EndDate">Event End Date</Label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="Pp"
                                        className="w-full rounded-md border px-3 py-2"
                                        minDate={startDate ?? undefined}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="ImageUrl">Event Image (flyer or graphic)</Label>
                                <div className="mt-2">
                                    <div
                                        className={`relative flex items-center justify-center w-full rounded-md border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 hover:border-gray-300 transition-colors ${isDragging ? 'border-blue-300 bg-blue-50' : ''}`}
                                        onClick={() => fileRef.current?.click()}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const f = e.dataTransfer?.files?.[0] ?? null;
                                            if (f) {
                                                setFileName(f.name);
                                                setImagePreview(URL.createObjectURL(f));
                                                // Populate the hidden file input so the native form submits the file
                                                try {
                                                    const dt = new DataTransfer();
                                                    dt.items.add(f);
                                                    if (fileRef.current) fileRef.current.files = dt.files;
                                                } catch (err) {
                                                    // DataTransfer might not be supported in some environments; ignore
                                                }
                                            }
                                        }}
                                    >
                                        <input
                                            ref={fileRef}
                                            id="ImageUrl"
                                            name="ImageUrl"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0] ?? null;
                                                if (f) {
                                                    setFileName(f.name);
                                                    setImagePreview(URL.createObjectURL(f));
                                                } else {
                                                    setFileName(null);
                                                    setImagePreview(null);
                                                }
                                            }}
                                        />

                                        {!imagePreview ? (
                                            <div className="flex flex-col items-center text-sm text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m8 4l-4 4-4-4" />
                                                </svg>
                                                <div className="mt-2">Click to upload or drag and drop</div>
                                                <div className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</div>
                                            </div>
                                        ) : (
                                            <div className="flex w-full items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={imagePreview} alt="preview" className="h-24 w-24 rounded-md object-cover border" />
                                                    <div className="flex flex-col text-sm">
                                                        <span className="font-medium">{fileName}</span>
                                                        <span className="text-xs text-gray-500">Selected image</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            setFileName(null);
                                                            setImagePreview(null);
                                                            if (fileRef.current) fileRef.current.value = '';
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Optional — add an attractive image to help promote your event.</p>
                                </div>
                            </div>

                            <fieldset className="border p-4">
                                <legend className="px-2">Address Details</legend>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="VenueName">Venue Name</Label>
                                        <Input id="VenueName" name="VenueName" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="PostCode">Post Code</Label>
                                        <Input id="PostCode" name="PostCode" required />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="AddressLine1">Address Line 1</Label>
                                    <Input id="AddressLine1" name="AddressLine1" required />
                                </div>

                                <div>
                                    <Label htmlFor="AddressLine2">Address Line 2</Label>
                                    <Input id="AddressLine2" name="AddressLine2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="City">City</Label>
                                        <Input id="City" name="City" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="Currency">Currency</Label>
                                        <Input id="Currency" name="Currency" placeholder="USD" required />
                                    </div>
                                </div>
                                {/* Facebook/LinkedIn links removed from Event form */}

                                <div>
                                    <Label htmlFor="EventVisibility">Event Visibility</Label>
                                    <select id="EventVisibility" name="EventVisibility" className="mt-1 block w-full rounded-md border px-3 py-2">
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </fieldset>

                            <div className="flex items-center justify-end gap-4">
                                <Button type="button" variant="secondary" onClick={() => history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Event</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
