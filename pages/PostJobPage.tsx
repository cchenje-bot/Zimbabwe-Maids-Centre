import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { JobCategory, Currency } from '../types';

interface PostJobPageProps {
  onBack: () => void;
}

const PostJobPage: React.FC<PostJobPageProps> = ({ onBack }) => {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    category: JobCategory.Maid,
    location: '',
    salary: '',
    currency: Currency.USD,
    duration: 'Long-term' as 'One-time' | 'Short-term' | 'Long-term',
    description: '',
    numberOfKids: '',
    agesOfKids: '',
    duties: '',
    numberOfRooms: '',
  });
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!keywords.trim()) {
      setGenerationError("Please enter some keywords to generate a description.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    setJobDetails(prev => ({ ...prev, description: '' }));

    const prompt = `Generate a professional, detailed, and appealing job description for a "${jobDetails.category}" position. The description should be suitable for a job posting. Use the following keywords as a guide: "${keywords}". Include responsibilities, requirements, and what the employer offers. Keep it friendly and encouraging.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const generatedText = response.text;
      setJobDetails(prev => ({ ...prev, description: generatedText }));
    } catch (error) {
      console.error("Failed to generate job description:", error);
      setGenerationError("Sorry, we couldn't generate a description at this time. Please try again later or write one manually.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd submit this data to your backend
    const finalJobDetails = {
      ...jobDetails,
      salary: parseInt(jobDetails.salary, 10),
      numberOfKids: jobDetails.numberOfKids ? parseInt(jobDetails.numberOfKids, 10) : undefined,
      numberOfRooms: jobDetails.numberOfRooms ? parseInt(jobDetails.numberOfRooms, 10) : undefined,
      duties: jobDetails.duties ? jobDetails.duties.split(',').map(d => d.trim()).filter(Boolean) : undefined,
    };
    console.log('Submitting new job:', finalJobDetails);
    alert('Job posted successfully! (This is a demo)');
    onBack();
  };

  const relevantCategories = [JobCategory.Maid, JobCategory.Chef, JobCategory.Cleaner, JobCategory.BabyMinder];
  const showExtraFields = relevantCategories.includes(jobDetails.category);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">Post a New Job</h2>
          <button onClick={onBack} className="text-emerald-600 hover:text-emerald-800 font-semibold">
            <i className="fas fa-times mr-2"></i> Cancel
          </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <input type="text" name="title" id="title" value={jobDetails.title} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select name="category" id="category" value={jobDetails.category} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md">
              {Object.values(JobCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input type="text" name="location" id="location" value={jobDetails.location} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">Job Duration</label>
            <select name="duration" id="duration" value={jobDetails.duration} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md">
              <option value="One-time">One-time</option>
              <option value="Short-term">Short-term</option>
              <option value="Long-term">Long-term</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
          <div className="flex">
            <select name="currency" value={jobDetails.currency} onChange={handleInputChange} className="p-2 border border-slate-300 rounded-l-md bg-slate-50 border-r-0 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
               {Object.values(Currency).map(cur => <option key={cur} value={cur}>{cur}</option>)}
            </select>
            <input type="number" name="salary" placeholder="Amount" value={jobDetails.salary} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-r-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required />
          </div>
        </div>
        
        {showExtraFields && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-6">
                <h3 className="text-lg font-bold text-slate-800">Job Specifics</h3>
                <div>
                    <label htmlFor="numberOfRooms" className="block text-sm font-medium text-slate-700 mb-1">Number of Rooms</label>
                    <input type="number" name="numberOfRooms" id="numberOfRooms" value={jobDetails.numberOfRooms} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" min="1" />
                </div>

                <div>
                    <label htmlFor="duties" className="block text-sm font-medium text-slate-700 mb-1">Duties to be Done (comma-separated)</label>
                    <input type="text" name="duties" id="duties" value={jobDetails.duties} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Cleaning, Cooking, Laundry" />
                </div>

                {[JobCategory.Maid, JobCategory.Chef, JobCategory.BabyMinder].includes(jobDetails.category) && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="numberOfKids" className="block text-sm font-medium text-slate-700 mb-1">Number of Kids (if any)</label>
                                <input type="number" name="numberOfKids" id="numberOfKids" value={jobDetails.numberOfKids} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" min="0" />
                            </div>
                            <div>
                                <label htmlFor="agesOfKids" className="block text-sm font-medium text-slate-700 mb-1">Ages of Kids (comma-separated)</label>
                                <input type="text" name="agesOfKids" id="agesOfKids" value={jobDetails.agesOfKids} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., 2, 5, 8" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}

        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <label htmlFor="keywords" className="block text-sm font-bold text-emerald-800 mb-2">AI Job Description Helper</label>
          <p className="text-sm text-emerald-700 mb-2">Enter a few keywords, and we'll generate a professional job description for you.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., trustworthy, good with kids, cooking"
              className="w-full p-2 border border-slate-300 rounded-md flex-grow focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> Generate Description
                </>
              )}
            </button>
          </div>
          {generationError && <p className="text-red-600 text-sm mt-2">{generationError}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
          <textarea
            name="description"
            id="description"
            rows={8}
            value={jobDetails.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="A detailed description will appear here after generation, or you can write your own."
            required
          ></textarea>
        </div>

        <div className="text-right">
          <button type="submit" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors">
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;