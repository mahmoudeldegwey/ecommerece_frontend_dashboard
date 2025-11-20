import { useState,useEffect } from 'react'
import { Modal, Button, TextInput, Label,Select } from "flowbite-react";
import {useTranslations} from 'next-intl';
import  { useSession } from 'next-auth/react'
import { toast } from 'react-toastify';
import { ClientChangePasswordSchema} from "@/utils/validationSchema";
import {editPassword} from '@/utils/actions/clients/actions'

interface Client {
    id: number;
    password: string;
    password_confirmation:string;
}

interface ChangePasswordModal {
    isOpen: boolean;
    onClose: () => void;
    refreshClientsList:() => void;
    clientData: Client
}

const ChangePasswordModal: React.FC<ChangePasswordModal> = ({ isOpen, onClose, refreshClientsList, clientData }) => {
    const [newClient, setNewClient] = useState<Client>({ id:0 ,password: "", password_confirmation:""});
    
    const { data: session } = useSession();
    
    const t = useTranslations('ClientsPage');
    const t_general = useTranslations('General');
    const t_validation = useTranslations('Validation');

    useEffect(() => {

        if (clientData) {
            setNewClient({
                id: clientData.id,
                password: clientData.password,
                password_confirmation: clientData.password_confirmation,
            });
        }

    }, [clientData]);


    const handleEdit =  async () => {
        const password = newClient.password;
        const password_confirmation = newClient.password_confirmation;

        const schema = ClientChangePasswordSchema(t_validation)
        const validation = schema.safeParse({ password , password_confirmation });
    
        if (!validation.success) {
            toast.error(validation.error.errors[0].message);
            return;
        }

        editPassword(session?.user?.token,clientData.id,password,password_confirmation).then((result) => {
            toast.success(result.message);
            refreshClientsList() 
            onClose();
        }).catch((error) => {
            toast.error(error.message);
        })        
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>{t('change_password')}</Modal.Header>
            <Modal.Body>
                <div className="space-y-4">

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
                <Button onClick={handleEdit} color="green">{t_general('edit')}</Button>
                <Button onClick={onClose} color="gray">{t_general('cancel')}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;
