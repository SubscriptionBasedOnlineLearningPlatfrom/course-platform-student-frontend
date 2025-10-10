import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import a router for testing
import Footer from "@/components/Footer";


jest.mock('@/assets/logo.jpeg', () => 'mocked-logo.jpeg');
describe("Footer Component", () => {
  test("renders footer and some key elements", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Use getAllByText for multiple "ProLearnX" occurrences
    const titles = screen.getAllByText(/ProLearnX/i);
    expect(titles.length).toBeGreaterThan(0);

    // Check for some links or text
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();

    // Check social media icons by aria-label
    expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
  });
});

