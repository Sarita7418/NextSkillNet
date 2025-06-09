import React, { useState } from 'react';
import FileInput from '../molecules/SubirArchivo'; // Ajusta la ruta si es necesario
import './SubirArchivo.css'; // Asegúrate que los estilos se carguen aquí o en el componente padre

interface Props {
    userId: number;
    tipoDocumentoId: number;
    onUploadSuccess: () => void;
}

const UploadDocument: React.FC<Props> = ({ userId, tipoDocumentoId, onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert('Selecciona un archivo');

        const formData = new FormData();
        formData.append('documento', file);
        formData.append('id_persona', userId.toString());
        formData.append('id_tipoDocumento', tipoDocumentoId.toString());

        try {
            setUploading(true);
            const res = await fetch('http://127.0.0.1:8000/documentos', { // ✅ Corrección del endpoint a '/documentos'
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                alert('Documento subido correctamente');
                setFile(null);
                onUploadSuccess();
            } else {
                alert('Error al subir el archivo: ' + data.message);
            }
        } catch (err) {
            console.error('Error en la carga:', err);
            alert('Error en la conexión o subida del archivo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <FileInput
                acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                labelText="Haz clic o arrastra un archivo aquí"
                onFileChange={setFile}
            />
            <button onClick={handleUpload} disabled={uploading || !file}>
                {uploading ? 'Subiendo...' : 'Subir Documento'}
            </button>
        </div>
    );
};

export default UploadDocument;