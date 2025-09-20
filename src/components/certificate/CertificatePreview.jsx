import { Award, Calendar, Star } from "lucide-react";
import { Card } from "../home/ui/card.jsx";
import schoolLogo from "../../assets/logo.jpeg"; // Adjust the path as necessary



// export const CertificatePreview = ({ data }) => {
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <Card className="relative w-full max-w-2xl mx-auto aspect-[4/3] p-12 shadow-certificate bg-gradient-to-br from-certificate-background via-white to-certificate-background/90 border-2 border-certificate-border overflow-hidden">
//       {/* Elegant border pattern */}
//       <div className="absolute inset-3 border-2 border-certificate-primary/20 rounded-lg"></div>
//       <div className="absolute inset-5 border border-certificate-accent/30 rounded-md"></div>

//       {/* Top decorative line */}
//       <div className="absolute top-8 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-certificate-primary to-transparent"></div>

//       {/* Bottom decorative line */}
//       <div className="absolute bottom-8 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-certificate-accent to-transparent"></div>

//       {/* Corner ornaments */}
//       <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-certificate-primary/40"></div>
//       <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-certificate-primary/40"></div>
//       <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-certificate-primary/40"></div>
//       <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-certificate-primary/40"></div>

//       {/* Decorative stars */}
//       <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
//         <Star className="w-4 h-4 text-certificate-accent" fill="currentColor" />
//       </div>
//       <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
//         <Star className="w-4 h-4 text-certificate-accent" fill="currentColor" />
//       </div>

//       {/* Main content */}
//       <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
//         {/* Company branding */}
//         <div className="space-y-3 mb-4">
//           <div className="relative p-2 bg-white/60 rounded-full shadow-sm">
//             <img
//               src="/lovable-uploads/3909375f-ebd0-4708-b13d-7c8624dbd74f.png"
//               alt="ProLearnX Logo"
//               className="w-14 h-14 mx-auto object-contain"
//             />
//           </div>
//           <div className="space-y-1">
//             <h2 className="text-xl font-bold text-certificate-primary tracking-[0.3em]">
//               PROLEARNX
//             </h2>
//             <p className="text-xs text-certificate-text/60 font-medium tracking-[0.2em] uppercase">
//               Learn Smart. Grow Fast
//             </p>
//           </div>
//         </div>

//         {/* Elegant divider */}
//         <div className="flex items-center gap-4 mb-4">
//           <div className="w-12 h-px bg-gradient-to-r from-transparent to-certificate-accent"></div>
//           <Star className="w-3 h-3 text-certificate-accent" fill="currentColor" />
//           <div className="w-12 h-px bg-gradient-to-l from-transparent to-certificate-accent"></div>
//         </div>

//         {/* Header */}
//         <div className="space-y-2 mb-6">
//           <h1 className="text-5xl font-bold text-certificate-text tracking-[0.15em] font-serif">
//             CERTIFICATE
//           </h1>
//           <p className="text-lg text-certificate-text/70 font-medium tracking-[0.3em] uppercase">
//             of Completion
//           </p>
//         </div>

//         {/* Student section */}
//         <div className="space-y-4 mb-6">
//           <p className="text-certificate-text/60 text-sm font-medium tracking-[0.2em] uppercase">
//             This is to certify that
//           </p>
//           <div className="relative">
//             <h2 className="text-3xl font-bold text-certificate-primary font-serif px-6 py-2 bg-white/40 rounded-lg shadow-sm border border-certificate-primary/20">
//               {data.studentName || "Student Name"}
//             </h2>
//           </div>
//         </div>

//         {/* Course section */}
//         <div className="space-y-3 mb-6">
//           <p className="text-certificate-text/60 text-sm font-medium tracking-[0.2em] uppercase">
//             has successfully completed the course
//           </p>
//           <h3 className="text-xl font-semibold text-certificate-text font-serif px-4 py-1 bg-white/30 rounded border border-certificate-accent/20">
//             {data.courseName || "Course Name"}
//           </h3>
//         </div>

//         {/* Date with elegant styling */}
//         <div className="flex items-center justify-center gap-3 mb-8 px-6 py-2 bg-white/30 rounded-full border border-certificate-border/20">
//           <Calendar className="w-4 h-4 text-certificate-primary" />
//           <p className="text-certificate-text/70 text-sm font-medium tracking-wide">
//             Issued on {formatDate(data.issueDate)}
//           </p>
//         </div>

//         {/* Elegant signature section */}
//         <div className="space-y-3">
//           <p className="text-xl font-bold text-certificate-primary italic font-serif tracking-wide">
//             Dr. Sarah Mitchell
//           </p>
//           <div className="flex items-center justify-center gap-4">
//             <div className="w-16 h-px bg-certificate-primary/40"></div>
//             <Star className="w-2 h-2 text-certificate-accent" fill="currentColor" />
//             <div className="w-16 h-px bg-certificate-primary/40"></div>
//           </div>
//           <p className="text-xs text-certificate-text/50 font-medium tracking-[0.2em] uppercase">
//             Academic Director
//           </p>
//         </div>
//       </div>
//     </Card>
//   );
// };











// export const CertificatePreview = ({ data }) => {
//   // Destructure with default values to prevent errors and show placeholders
//   const { 
//     studentName = "Your Name Here", 
//     courseName = "Course Title", 
//     issueDate = new Date().toISOString()
//   } = data || {};

//   const formatDate = (dateString) => {
//     // Ensure the date is valid before formatting
//     if (!dateString || isNaN(new Date(dateString))) {
//       return "Select a Date";
//     }
//     const date = new Date(dateString);
//     // Use UTC to avoid timezone issues during formatting
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       timeZone: 'UTC'
//     });
//   };

//   return (
//     <div className="relative w-full h-full p-10 shadow-lg bg-white border-8 border-blue-900 flex flex-col justify-between items-center text-center font-serif">

//       {/* Decorative elements for a classic look */}
//       <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-yellow-500"></div>
//       <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-yellow-500"></div>
//       <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-yellow-500"></div>
//       <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-yellow-500"></div>

//       <header className="w-full">
//         <h1 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-wider">
//           Certificate of Completion
//         </h1>
//         <div className="w-48 h-1 bg-yellow-500 mx-auto mt-4"></div>
//       </header>

//       <main className="flex flex-col items-center justify-center space-y-4 my-8">
//         <p className="text-lg md:text-xl text-gray-700">This is to certify that</p>
//         <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 tracking-wide break-words px-4">
//           {studentName || "Your Name Here"}
//         </h2>
//         <p className="text-lg md:text-xl text-gray-700">has successfully completed the course</p>
//         <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 break-words px-4">
//           {courseName || "Course Title"}
//         </h3>
//       </main>

//       <footer className="w-full flex justify-between items-end">
//         <div className="text-left">
//           <p className="text-base md:text-lg font-semibold border-t-2 border-gray-700 pt-1">Date of Issue</p>
//           <p className="text-sm md:text-md text-gray-600">{formatDate(issueDate)}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-base md:text-lg font-semibold border-t-2 border-gray-700 pt-1">Authorized Signature</p>
//           <p className="text-sm md:text-md text-gray-600">Online Learning Platform</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

export const CertificatePreview = ({ data }) => {
  // Destructure with default values to prevent errors and placeholders
  const {
    studentName = "Your Name Here",
    courseName = "Course Title",
    issueDate = new Date().toISOString(),
  } = data || {};

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) {
      return "Select a Date";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'UTC'
    });
  };

  return (
    <div className="relative w-full h-full min-h-[550px] shadow-lg bg-white border-8 border-blue-900 flex flex-col justify-between items-center text-center font-serif">

      {/* Decorative corners */}
      <div className="absolute top-1 left-1 w-12 h-12 border-l-4 border-t-4 border-yellow-500"></div>
      <div className="absolute top-1 right-1 w-12 h-12 border-r-4 border-t-4 border-yellow-500"></div>
      <div className="absolute bottom-1 left-1 w-12 h-12 border-l-4 border-b-4 border-yellow-500"></div>
      <div className="absolute bottom-1 right-1 w-12 h-12 border-r-4 border-b-4 border-yellow-500"></div>

      {/* Company Branding */}
      <div className="flex flex-col items-center pt-8 mb-4">
        <img
          src={schoolLogo}
          alt="Company Logo"
          className="w-16 h-16 object-contain"
        />
        <h2 className="mt-1 text-3xl font-bold text-blue-900 tracking-widest">
          ProLearnx
        </h2>
        <p className="text-sm text-gray-500 tracking-wider uppercase">
          Learn Smart. Grow Fast
        </p>
      </div>

      {/* Certificate Title */}
      <header className="w-full">
        <h1 className="text-6xl md:text-4xl font-bold text-blue-900 tracking-wider mt-1">
          Certificate of Completion
        </h1>
        <div className="w-48 h-1 bg-yellow-500 mx-auto mt-0"></div>
      </header>

      {/* Student Info */}
      <main className="flex flex-col items-center justify-center space-y-4 my-8 flex-1">
        <p className="text-lg md:text-0.5xl text-gray-700">This is to certify that</p>
        <h2 className="text-3xl md:text-2xl font-extrabold text-blue-800 tracking-wide break-words px-4">
          {studentName}
        </h2>
        <p className="text-lg md:text-0.5xl text-gray-700">has successfully completed the course</p>
        <h3 className="text-3xl md:text-2xl font-semibold text-gray-800 break-words px-4">
          {courseName}
        </h3>
      </main>

      {/* Footer Section (always at bottom) */}
      <footer className="w-full flex justify-between items-end px-10 pb-6">
        <div className="text-left">
          <p className="text-base md:text-lg font-semibold  pt-1">Date of Issue</p>
          <p className="text-sm md:text-md text-gray-600">{formatDate(issueDate)}</p>
        </div>
        <div className="text-right">
          <p className="font-[cursive] text-xl text-gray-800 mb-1 italic">
            s. sivapriya
          </p>
          <div className="border-t-2 border-gray-700 pt-1">
            <p className="text-xl md:text-lg font-semibold text-gray-900">
              Authorized Signature
            </p>
            <p className="text-sm md:text-md text-gray-600">
              Online Learning Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
