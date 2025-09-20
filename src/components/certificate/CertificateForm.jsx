import { useEffect, useState } from "react";
import { Button } from "../home/ui/button.jsx";
import { Input } from "../home/ui/input.jsx";
import { Label } from "../home/ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../home/ui/card.jsx";
import { CalendarIcon, UserIcon, GraduationCapIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";

// export const CertificateForm = ({ onGenerateCertificate, isGenerating }) => {
//   const [formData, setFormData] = useState({
//     studentName: "",
//     courseName: "",
//     issueDate: new Date().toISOString().split('T')[0],
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.studentName.trim()) {
//       toast.error("Please enter your name");
//       return;
//     }
//     if (!formData.courseName.trim()) {
//       toast.error("Please enter the course name");
//       return;
//     }

//     onGenerateCertificate(formData);
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-elegant">
//       <CardHeader className="text-center pb-6">
//         <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
//           <GraduationCapIcon className="w-8 h-8 text-white" />
//         </div>
//         <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Create Certificate
//         </CardTitle>
//         <p className="text-muted-foreground">
//           Generate your course completion certificate
//         </p>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="studentName" className="flex items-center gap-2 font-medium">
//               <UserIcon className="w-4 h-4 text-primary" />
//               Student Name
//             </Label>
//             <Input
//               id="studentName"
//               type="text"
//               placeholder="Enter your full name"
//               value={formData.studentName}
//               onChange={(e) => handleInputChange("studentName", e.target.value)}
//               className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="courseName" className="flex items-center gap-2 font-medium">
//               <GraduationCapIcon className="w-4 h-4 text-primary" />
//               Course Name
//             </Label>
//             <Input
//               id="courseName"
//               type="text"
//               placeholder="Enter the course name"
//               value={formData.courseName}
//               onChange={(e) => handleInputChange("courseName", e.target.value)}
//               className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="issueDate" className="flex items-center gap-2 font-medium">
//               <CalendarIcon className="w-4 h-4 text-primary" />
//               Issue Date
//             </Label>
//             <Input
//               id="issueDate"
//               type="date"
//               value={formData.issueDate}
//               onChange={(e) => handleInputChange("issueDate", e.target.value)}
//               className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={isGenerating}
//             className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
//           >
//             {isGenerating ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
//                 Generating Certificate...
//               </>
//             ) : (
//               <>
//                 <DownloadIcon className="w-4 h-4 mr-2" />
//                 Generate Certificate
//               </>
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };


export const CertificateForm = ({ initialData, onDataChange, onSubmit, isGenerating }) => {
  // The form's state is initialized and updated by the parent component
  const [formData, setFormData] = useState(initialData);

  // When the initialData from the parent changes (e.g., course name is fetched), update the form
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Handle changes to any input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData); // Update local state
    onDataChange(updatedFormData); // Update parent state for live preview
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // The parent component will handle validation before calling the PDF generator
    onSubmit(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="studentName">
          <UserIcon className="inline-block w-4 h-4 mr-2" />
          Your Full Name
        </Label>
        <Input
          id="studentName"
          name="studentName"
          type="text"
          placeholder="e.g., Priya S"
          value={formData.studentName}
          onChange={handleChange}
          required
          aria-label="Your Full Name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="courseName">
          <GraduationCapIcon className="inline-block w-4 h-4 mr-2" />
          Course Name
        </Label>
        <Input
          id="courseName"
          name="courseName"
          type="text"
          value={formData.courseName}
          readOnly // This field is populated from the course card and cannot be edited
          className="bg-gray-100 cursor-not-allowed"
          aria-label="Course Name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="issueDate">
          <CalendarIcon className="inline-block w-4 h-4 mr-2" />
          Date of Issue
        </Label>
        <Input
          id="issueDate"
          name="issueDate"
          type="date"
          value={formData.issueDate}
          onChange={handleChange}
          required
          aria-label="Date of Issue"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isGenerating}>
        {isGenerating ? (
          "Generating..."
        ) : (
          <>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Generate & Download PDF
          </>
        )}
      </Button>
    </form>
  );
};