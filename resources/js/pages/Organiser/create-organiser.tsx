// import AppLayout from '@/layouts/app-layout';
import { Head, Form, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';

export default function CreateOrganiser() {
    const { flash } = usePage().props as any;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    // Logo upload state
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // Revoke the object URL when component unmounts or preview changes
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    return (

        <>
            <Head title="Create Organiser" />

            <div className="flex items-center justify-center px-4 py-12 bg-gray-300">
                <div className="w-full max-w-xl">
                    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-neutral-900">
                        {flash?.success && (
                            <div className="mb-4 flex items-center gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800 shadow-sm animate-fade-in">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="size-5 text-green-600"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="font-medium">{flash.success}</span>
                            </div>
                        )}

                        <h1 className="mb-2 text-center text-2xl font-semibold">Create Organiser</h1>
                        <p className="mb-6 text-center text-sm text-muted-foreground">
                            Before you create events you'll need to create an organiser. An
                            organiser is simply whoever is organising the event. It can be a
                            person or an organisation.
                        </p>

                        <Form className="space-y-6" method="post" action="/organiser" encType="multipart/form-data">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="organiser_name">Organiser name</Label>
                                    <Input
                                        id="organiser_name"
                                        name="organiser_name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Organiser name"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="organiser_email">Organiser email</Label>
                                    <Input
                                        id="organiser_email"
                                        name="organiser_email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        type="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Organiser description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-2 h-40 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                                    placeholder="Describe the organiser..."
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <div>
                                    <Label>Do you want to charge tax as your events?</Label>
                                    <div className="mt-2 flex gap-4 text-sm">
                                        <label className="inline-flex items-center gap-2">
                                            <input type="radio" name="charge_tax" />
                                            <span>Yes</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2">
                                            <input type="radio" name="charge_tax" defaultChecked />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-1" />
                            </div>

                            <div>
                                <Label htmlFor="facebook_link">Organiser Facebook</Label>
                                <Input
                                    id="facebook_link"
                                    name="facebook_link"
                                    value={facebookLink}
                                    onChange={(e) => setFacebookLink(e.target.value)}
                                    placeholder="facebook.com/YourPage"
                                />
                            </div>

                            <div>
                                <Label htmlFor="logo">Organiser logo</Label>
                                <div className="mt-2">
                                    <div
                                        className={`relative flex items-center justify-center w-full rounded-md border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 hover:border-gray-300 transition-colors ${isDragging ? 'border-blue-300 bg-blue-50' : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
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
                                                setLogoPreview(URL.createObjectURL(f));
                                                // Populate the hidden file input so the native form submits the file
                                                try {
                                                    const dt = new DataTransfer();
                                                    dt.items.add(f);
                                                    if (fileInputRef.current) fileInputRef.current.files = dt.files;
                                                } catch (err) {
                                                    // DataTransfer may not be available in some browsers/environments
                                                }
                                            }
                                        }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="logo"
                                            name="logo"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0] ?? null;
                                                setLogoFile(f);
                                                if (f) {
                                                    setFileName(f.name);
                                                    setLogoPreview(URL.createObjectURL(f));
                                                } else {
                                                    setFileName(null);
                                                    setLogoPreview(null);
                                                }
                                            }}
                                        />

                                        {!logoPreview ? (
                                            <div className="flex flex-col items-center text-sm text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m8 4l-4 4-4-4" />
                                                </svg>
                                                <div className="mt-2">Click to upload or drag and drop</div>
                                                <div className="mt-1 text-xs text-gray-500">SVG, PNG or JPG — max 5MB</div>
                                            </div>
                                        ) : (
                                            <div className="flex w-full items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={logoPreview} alt="logo preview" className="h-20 w-20 rounded-md object-cover border" />
                                                    <div className="flex flex-col text-sm">
                                                        <span className="font-medium">{fileName}</span>
                                                        <span className="text-xs text-gray-500">Selected logo</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            setFileName(null);
                                                            setLogoPreview(null);
                                                            setLogoFile(null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Optional — add a logo to represent your organiser.</p>
                                </div>
                            </div>

                            <div>
                                <Button type="submit" className="w-full">
                                    Create Organiser
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
        // </AppLayout>
    );
}
