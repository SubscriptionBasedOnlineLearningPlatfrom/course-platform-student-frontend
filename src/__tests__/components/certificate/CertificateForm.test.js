import { render, screen, fireEvent } from "@testing-library/react";
import { CertificateForm } from "../../../components/certificate/CertificateForm";

test("renders form inputs and submits correctly", () => {
  const initialData = {
    studentName: "John Doe",
    courseName: "React Basics",
    issueDate: "2025-10-08",
  };

  const mockOnDataChange = jest.fn();
  const mockOnSubmit = jest.fn();

  render(
    <CertificateForm
      initialData={initialData}
      onDataChange={mockOnDataChange}
      onSubmit={mockOnSubmit}
      isGenerating={false}
    />
  );

  // Check inputs render
  expect(screen.getByLabelText(/Your Full Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Course Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Date of Issue/i)).toBeInTheDocument();

  // Change student name
  fireEvent.change(screen.getByLabelText(/Your Full Name/i), {
    target: { value: "Jane Smith" },
  });
  expect(mockOnDataChange).toHaveBeenCalledWith({
    ...initialData,
    studentName: "Jane Smith",
  });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: /Generate & Download PDF/i }));
  expect(mockOnSubmit).toHaveBeenCalled();
});
