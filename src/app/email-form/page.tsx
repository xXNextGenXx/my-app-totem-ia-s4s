"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'; 
import emailjs from 'emailjs-com'; 

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const searchParams = useSearchParams(); 

  useEffect(() => {
    const imageSrcParam = searchParams.get('imageUrl'); 
    if (imageSrcParam) {
      setImageSrc(imageSrcParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageSrc) {
      const templateParams = {
        email,
        message,
        capturedImage: imageSrc
      };

      emailjs.send(process.env.NEXT_PUBLIC_SERVICE_EMAIL_JS as string, process.env.NEXT_PUBLIC_TEMPLATE_EMAIL_JS as string, templateParams, process.env.NEXT_PUBLIC_PASSWORD_EMAIL_JS)
        .then((response) => {
          console.log('Email enviado com sucesso!', response.status, response.text);
          setStatus('success');
        })
        .catch((err) => {
          console.error('Erro ao enviar o email:', err);
          setStatus('error');
        });
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl mb-8">Preencha o formulário para receber sua foto por e-mail</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Mensagem (opcional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Enviar
          </button>
        </div>
      </form>

      {status === 'success' && <p className="text-green-500 mt-4">Email enviado com sucesso!</p>}
      {status === 'error' && <p className="text-red-500 mt-4">Erro ao enviar o email. Tente novamente.</p>}
    </div>
  );
}
