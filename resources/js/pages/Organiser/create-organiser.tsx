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
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // Revoke the object URL when component unmounts or preview changes
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    return (
        // <AppLayout>
        <>
            <Head title="Create Organiser" />

            <div className="flex items-center justify-center px-4 py-12 bg-gray-300">
                <div className="w-full max-w-xl">
                    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-neutral-900">
                        {flash?.success && (
                            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                                {flash.success}
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
                                <div className="mt-2 flex items-center gap-4">
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
                                                const url = URL.createObjectURL(f);
                                                setLogoPreview(url);
                                            } else {
                                                setLogoPreview(null);
                                            }
                                        }}
                                    />

                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-dashed border-muted-foreground/30 bg-muted p-1">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                                    No logo
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    type="button"
                                                    className="bg-neutral-700 text-white px-4 py-2 rounded-md shadow-sm"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Browse…
                                                </Button>

                                                {logoFile && (
                                                    <Button
                                                        type="button"
                                                        className="bg-transparent text-sm text-muted-foreground"
                                                        onClick={() => {
                                                            setLogoFile(null);
                                                            setLogoPreview(null);
                                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            {/* <div className="mt-2 text-xs text-muted-foreground">
                                                    {logoFile ? logoFile.name : 'SVG, PNG or JPG — max 2MB'}
                                                </div> */}
                                        </div>
                                    </div>
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
