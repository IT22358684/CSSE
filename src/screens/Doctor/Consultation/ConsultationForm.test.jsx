import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ConsultationForm from './ConsultationForm'; // Adjust the path as necessary
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path as necessary

jest.mock('firebase/firestore'); // Mock Firestore functions

// Mock patient data
const mockPatientData = {
    exists: () => true,
    data: () => ({
        Name: 'John Doe',
        physicalExam: {
            bloodPressure: '120/80',
            pulse: '72',
            temperature: '98.6',
            respirationRate: '16',
            oxygenSaturation: '98',
        },
        height: '175',
        weight: '70',
        dateOfBirth: { seconds: 1000000000 },
    })
};

// Mock empty patient data (for negative cases)
const mockEmptyPatientData = {
    exists: () => false
};

describe('ConsultationForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    // Positive Test Case 1: Renders patient data correctly
    test('renders patient data correctly', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data

        render(
            <MemoryRouter initialEntries={['/consultation/patient123']}>
                <Routes>
                    <Route path="/consultation/:id" element={<ConsultationForm />} />
                </Routes>
            </MemoryRouter>
        );

        // Check that the patient's name is displayed correctly
        expect(await screen.findByText(/Consultation for John Doe/i)).toBeInTheDocument(); 

        // Check that the blood pressure value is displayed correctly
        expect(await screen.findByLabelText(/Blood Pressure:/i)).toHaveValue('120/80'); 

        // Check that the pulse value is displayed correctly
        expect(await screen.findByLabelText(/pulse:/i)).toHaveValue('72'); 
    });

    // Negative Test Case 1: Shows message when no patient data is found
    test('shows message when no patient data is found', async () => {
        getDoc.mockResolvedValue(mockEmptyPatientData); // Mock Firestore to return no patient data

        render(
            <MemoryRouter initialEntries={['/consultation/patient123']}>
                <Routes>
                    <Route path="/consultation/:id" element={<ConsultationForm />} />
                </Routes>
            </MemoryRouter>
        );

        // Check error message when no patient data exists
        expect(await screen.findByText(/Patient document does not exist./)).toBeInTheDocument(); 
    });

    // Positive Test Case 2: Updates consultation notes successfully
    test('updates consultation notes successfully', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data
        const { container } = render(
            <MemoryRouter initialEntries={['/consultation/patient123']}>
                <Routes>
                    <Route path="/consultation/:id" element={<ConsultationForm />} />
                </Routes>
            </MemoryRouter>
        );

        // Fill out the consultation notes field
        fireEvent.change(screen.getByLabelText(/Consultation Notes:/i), {
            target: { value: 'This is a consultation note.' },
        });

        // Assuming there's a submit button to click after filling out the form
        fireEvent.click(screen.getByText(/Submit/i));

        // Check if updateDoc was called to confirm successful update
        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalled(); 
        });
    });

    // Positive Test Case 3: Displays loading message while fetching data
    test('displays loading message while fetching data', () => {
        getDoc.mockReturnValue(new Promise(() => { })); // Simulate loading state

        render(
            <MemoryRouter initialEntries={['/consultation/patient123']}>
                <Routes>
                    <Route path="/consultation/:id" element={<ConsultationForm />} />
                </Routes>
            </MemoryRouter>
        );

        // Loading message should be shown while fetching data
        expect(screen.getByText(/Loading patient data/i)).toBeInTheDocument(); 
    });

    // Positive Test Case 4: Does not display loading message after data is loaded
    test('does not display loading message after data is loaded', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock resolved patient data

        render(
            <MemoryRouter initialEntries={['/consultation/patient123']}>
                <Routes>
                    <Route path="/consultation/:id" element={<ConsultationForm />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the loading message to disappear
        await waitFor(() => {
            expect(screen.queryByText(/Loading patient data/i)).not.toBeInTheDocument(); // Check that loading message is gone
        });
    });

    // Negative Test Case 2: Shows error message when consultation notes are empty
    test('shows error message when consultation notes are empty', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data
    
        render(
            <MemoryRouter initialEntries={['/consultation/patient123']}>
                <Routes>
                    <Route path="/consultation/:id" element={<ConsultationForm />} />
                </Routes>
            </MemoryRouter>
        );
    
        // Fill out the other form fields except consultation notes
        fireEvent.change(screen.getByLabelText(/Consultation Date:/i), {
            target: { value: '2024-10-17' },
        });
        
        fireEvent.change(screen.getByLabelText(/Diagnosis:/i), {
            target: { value: 'Flu' },
        });
    
        fireEvent.change(screen.getByLabelText(/Symptoms:/i), {
            target: { value: 'Cough and fever' },
        });
    
        // Click the submit button
        fireEvent.click(screen.getByText(/Submit/i));
    
        // Expect an error message about consultation notes being required
        expect(await screen.findByText(/Consultation notes are required./)).toBeInTheDocument(); // Check for error message
    });
    
});
