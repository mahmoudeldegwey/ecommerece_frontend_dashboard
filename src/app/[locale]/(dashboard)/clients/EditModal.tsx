import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { ClientEditSchema} from "@/utils/validationSchema";
import {editClient,clientSingle} from '@/utils/actions/clients/actions'

interface Client {
    id: number;
    username: string;
    email: string;
    // password: string;
    // password_confirmation:string
}

interface EditModal {
    isOpen: boolean;
    onClose: () => void;
    refreshClientsList:() => void;
    clientData: Client
}

const EditModal: React.FC<EditModal> = ({ isOpen, onClose, refreshClientsList, clientData }) => {
    const [newClient, setNewClient] = useState<Client>({ id:0 ,username: "", email:""});
    
    const { data: session } = useSession();
    
    const t = useTranslations('ClientsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    useEffect(() => {
        if (clientData) {
            setNewClient({
                id: clientData.id,
                username: clientData.username,
                email: clientData.email
            });
        }

    }, [clientData]);


    const handleEdit =  async () => {

        const username = newClient.username;
        const email = newClient.email;

        const schema = ClientEditSchema(t_validation)
        const validation = schema.safeParse({ username , email });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        editClient(session?.user?.token,clientData.id,username,email).then((result) => {
            toast.success(result.message);
            refreshClientsList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('edit_client')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <div>
                        <Label>{t('username')}</Label>
                        <TextInput
                            value={newClient.username}
                            onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
                            placeholder={t_general('name')}
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
                    {/* <div>
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
                    </div> */}

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleEdit} color="green">{t_general('edit')}</Button>
                <Button onClick={onClose} color="gray">{t_general('cancel')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
