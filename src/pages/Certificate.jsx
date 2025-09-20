// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { CertificateForm } from "../Components/Certificate/CertificateForm";
// import { CertificatePreview } from "../Components/Certificate/CertificatePreview";
// import { generateCertificatePDF } from "../services/pdfGenerator";
// import { GraduationCap, Award, Sparkles } from "lucide-react";
// import { toast } from "sonner";

// // --- TODO: You will need a function to fetch data based on courseId.
// // ...existing code...
// // --- TODO: You will need a function to fetch data based on courseId.
// // For example: import { getCertificateDetails } from '@/services/courseService';

// const CertificatePage = () => {
//   const { courseId } = useParams(); // Get courseId from the URL
//   const [certificateData, setCertificateData] = useState({
//     studentName: "",
//     courseName: "",
//     issueDate: new Date().toISOString().split('T')[0]
//   });
//   const [isGenerating, setIsGenerating] = useState(false);

//   useEffect(() => {
//     const fetchCertificateData = async () => {
//       // This is a placeholder for your actual data fetching logic.
//       // You should replace this with an API call to your backend
//       // to get the student's name (from session/context) and the
//       // course name using the courseId.
//       try {
//         console.log(`Fetching data for course ID: ${courseId}`);
//         // const data = await getCertificateDetails(courseId);
        
//         // --- Mock data for demonstration ---
//         const mockData = {
//           studentName: "Priya S", // This should come from your user context or an API call
//           courseName: `The Complete ${courseId.replace('-', ' ')} Course`, // Example: derive from ID
//         };
//         // --- End of Mock data ---

//         setCertificateData(prev => ({ 
//           ...prev, 
//           studentName: mockData.studentName, 
//           courseName: mockData.courseName 
//         }));
//       } catch (error) {
//         console.error("Failed to fetch certificate details:", error);
//         toast.error("Could not load certificate information.");
//       }
//     };

//     if (courseId) {
//       fetchCertificateData();
//     }
//   }, [courseId]); // This effect runs when the component mounts and when courseId changes

//   const handleGenerateCertificate = async (data) => {
//     setIsGenerating(true);
//     setCertificateData(data);

//     try {
//       toast.success("Generating your certificate...");
//       await generateCertificatePDF(data);
//       toast.success("Certificate generated successfully!");
//     } catch (error) {
//       console.error("Error generating certificate:", error);
//       toast.error("Failed to generate certificate. Please try again.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="text-center mb-8">
//           <Award className="mx-auto h-12 w-12 text-blue-600" />
//           <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Certificate Generator
//           </h1>
//           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
//             Congratulations on completing your course! Fill in the details below to generate your official certificate.
//           </p>
//         </header>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//           {/* Form Section */}
//           <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
//             <div className="flex items-center mb-4">
//               <GraduationCap className="h-6 w-6 text-blue-600 mr-3" />
//               <h2 className="text-xl font-semibold text-gray-800">Certificate Details</h2>
//             </div>
//             <CertificateForm
//               initialData={certificateData}
//               onSubmit={handleGenerateCertificate}
//               isGenerating={isGenerating}
//             />
//           </div>

//           {/* Preview Section */}
//           <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
//             <div className="flex items-center mb-4">
//               <Sparkles className="h-6 w-6 text-blue-600 mr-3" />
//               <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
//             </div>
//             <div className="aspect-[1.414] w-full overflow-hidden rounded-md border border-gray-200">
//               {/* A4 aspect ratio */}
//               <CertificatePreview data={certificateData} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatePage;
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CertificateForm } from "../Components/Certificate/CertificateForm";
import { CertificatePreview } from "../Components/Certificate/CertificatePreview";
import { generateCertificatePDF } from "../services/pdfGenerator";
import { GraduationCap, Award, Sparkles } from "lucide-react";
import { toast } from "sonner";

const CertificatePage = () => {
  const { courseId } = useParams(); // Get courseId from the URL
  const [certificateData, setCertificateData] = useState({
    studentName: "", // Student name will be entered by the user in the form
    courseName: "",  // Course name will be fetched based on courseId
    issueDate: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Effect to fetch the course name when the page loads
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        // --- TODO: Replace this with your actual API call to get course details ---
        // For demonstration, we'll create a course name from the ID.
        const mockCourseName = `The Complete ${courseId.replace('-', ' ')} Course`;
        
        setCertificateData(prev => ({ 
          ...prev, 
          courseName: mockCourseName 
        }));
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        toast.error("Could not load course information.");
      }
    };

    if (courseId) {
      fetchCourseName();
    }
  }, [courseId]); // This effect runs when courseId changes

  // This function updates the state as the user types in the form
  const handleDataChange = (newData) => {
    setCertificateData(newData);
  };

  // This function is called when the form is submitted
  const handleGenerateCertificate = async () => {
    if (!certificateData.studentName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    
    setIsGenerating(true);
    try {
      toast.success("Generating your certificate...");
      // Use the current, complete state to generate the PDF
      await generateCertificatePDF(certificateData);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <Award className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Certificate 
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Confirm your details below to generate your official certificate.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Certificate Details</h2>
            </div>
            <CertificateForm
              initialData={certificateData}
              onDataChange={handleDataChange}
              onSubmit={handleGenerateCertificate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-3 bg-white  rounded-lg shadow-md">
            
            <div className="aspect-[1.3] w-full overflow-hidden rounded-md border border-gray-200">
              {/* A4 aspect ratio */}
              <CertificatePreview data={certificateData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;