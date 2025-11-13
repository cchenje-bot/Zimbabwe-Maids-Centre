import React, { useState } from 'react';
import { mockEmployees } from '../constants';
import { EmergencyContact } from '../types';

// For demonstration, we'll assume the logged-in employee is the first one.
const currentEmployee = mockEmployees[0];

interface EmergencyContactsPageProps {
  onBack: () => void;
}

const EmergencyContactsPage: React.FC<EmergencyContactsPageProps> = ({ onBack }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(currentEmployee.emergencyContacts);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContactName.trim() && newContactPhone.trim()) {
      const newContact: EmergencyContact = {
        id: Date.now(), // simple unique id for demo
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
      };
      setContacts([...contacts, newContact]);
      setNewContactName('');
      setNewContactPhone('');
      // In a real app, you'd call an API here.
    }
  };

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    // In a real app, you'd call an API here.
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Emergency Contacts</h2>
        <button onClick={onBack} className="text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-times mr-2"></i> Close
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-800">
        <p>
          <i className="fas fa-exclamation-triangle mr-2"></i>
          These contacts will be notified if you use the SOS button. Please keep this list up to date.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4">Your Contacts</h3>
        <div className="space-y-3">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div key={contact.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{contact.name}</p>
                  <p className="text-sm text-slate-500">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Delete ${contact.name}`}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">You have no emergency contacts saved.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-4">Add a New Contact</h3>
        <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
            <input
              id="contact-name"
              type="text"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="e.g., John Doe (Brother)"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              id="contact-phone"
              type="tel"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              placeholder="+263 77 000 0000"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="md:col-span-1 bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyContactsPage;