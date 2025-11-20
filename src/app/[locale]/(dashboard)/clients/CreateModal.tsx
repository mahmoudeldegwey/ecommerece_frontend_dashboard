import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { ClientSchema} from "@/utils/validationSchema";
import {createClient} from '@/utils/actions/clients/actions'

interface Client {
    username: string;
    email: string;
    password: string;
    password_confirmation:string
}

interface CreateModal {
    isOpen: boolean;
    onClose: () => void;
    refreshClientsList:() => void
}

const CreateModal: React.FC<CreateModal> = ({ isOpen, onClose, refreshClientsList }) => {
    const [newClient, setNewClient] = useState<Client>(
        { username: "", email:"",password:"",password_confirmation:""}
    );
    
    const { data: session } = useSession();
    
    const t = useTranslations('ClientsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');


    const handleCreate =  async () => {

        const username = newClient.username;
        const email = newClient.email;
        const password = newClient.password;
        const password_confirmation = newClient.password_confirmation;

        const schema = ClientSchema(t_validation)
        
        const validation = schema.safeParse({ username , email, password , password_confirmation });
 
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        createClient(session?.user?.token,username,email, password, password_confirmation).then((result) => {
            toast.success(result.message);
            refreshClientsList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('create_client')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <div>
                        <Label>{t('username')}</Label>
                        <TextInput
                            value={newClient.username}
                            onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
                            placeholder={t('username')}
                        />
                    </div>
                    <div>
                        <Label>{t_general('email')}</Label>
                        <TextInput
                            value={newClient.email}
                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                            placeholder={t_general('email')}
                        />
                    </div>
                    <div>
                        <Label>{t_general('password')}</Label>
                        <TextInput
                            value={newClient.password}
                            onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                            placeholder={t_general('password')}
                            type='password'
                        />
                    </div>
                    <div>
                        <Label>{t_general('password_confirmation')}</Label>
                        <TextInput
                            value={newClient.password_confirmation}
                            onChange={(e) => setNewClient({ ...newClient, password_confirmation: e.target.value })}
                            placeholder={t_general('password_confirmation')}
                            type='password'
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleCreate} color="green">Create</Button>
                <Button onClick={onClose} color="gray">Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateModal;
