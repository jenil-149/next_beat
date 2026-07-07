import { useState } from 'react';
import Modal from './Modal';
import useUploadModal from '@/frontend/hooks/useUploadModal';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import toast from 'react-hot-toast';
import { useUser } from '@/frontend/hooks/useUser';
import uniqid from 'uniqid'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
const UploadModal = () => {
    const uploadModal = useUploadModal();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();

        }
    }
    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: "",
            title: "",
            song: null,
            image: null,
        }
    })

    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser()

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true)

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];
            if (!imageFile || !songFile || !user) {
                toast.error("Missing fields")
                return
            }
            const uniqueID = uniqid();
            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });
            if (songError) {
                setIsLoading(false);
                return toast.error('Failed song upload');
            }
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });
            if (imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload');
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from("songs")
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path,
                });

            if (supabaseError) {
                setIsLoading(false)
                return toast.error(supabaseError.message)
            }
            router.refresh();
            setIsLoading(false);
            toast.success('Success')
            reset();
            uploadModal.onClose()

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }


    }
    return (
        <Modal
            title="Upload your Song!"
            description="Upload a mp3 file and cover image for the song with Title and Author name."
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)}
                className="
            flex
            flex-col
            gap-y-4
            ">

                <Input
                    id="title"
                    disabled={isLoading}
                    {...register("title", { required: true })}
                    placeholder="Song"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register("author", { required: true })}
                    placeholder="Author"
                />
                <div>
                    <div className="
                    
                    pb-1">
                        Select a song file
                    </div>
                    <Input
                        id='song'
                        type='file'
                        disabled={isLoading}
                        accept='audio/*'
                        {...register('song', { required: true })}
                    >
                    </Input>
                </div>
                <div>
                    <div className="
                    
                    pb-1">
                        Select a Image file
                    </div>
                    <Input
                        id='image'
                        type='file'
                        disabled={isLoading}
                        accept='image/*'
                        {...register('image', { required: true })}
                    >
                    </Input>
                </div>
                <Button type="submit" disabled={isLoading}>
                    Upload
                </Button>
            </form>
        </Modal>
    );
};

export default UploadModal;