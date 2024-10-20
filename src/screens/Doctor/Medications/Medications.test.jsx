import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Medications from './medications'; // Adjust the path as necessary
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firebase Firestore functions
import { db } from '../../firebase'; // Adjust the path as necessary

jest.mock('firebase/firestore'); // Mock Firestore functions

// Mock patient data
const mockPatientData = {
    exists: () => true,
    data: () => ({
        Name: 'Jane Doe',
        medications: [
            { label: 'Aspirin', dosage: '100mg' }
        ],
    }),
};

// Mock empty patient data (for negative cases)
const mockEmptyPatientData = {
    exists: () => false
};

describe('medications Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
        global.alert = jest.fn();
    });

    // Positive Test Case 1: Renders patient medication details correctly
    test('renders patient medication details correctly', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data

        render(
            <MemoryRouter initialEntries={['/medications/patient123']}>
                <Routes>
                    <Route path="/medications/:id" element={<Medications />} />
                </Routes>
            </MemoryRouter>
        );

        // Check for the patient's name "Jane Doe"
        expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();

        // Check if "Aspirin" medication is listed
        expect(await screen.findByText(/Aspirin/i)).toBeInTheDocument();

        // Check if "100mg" dosage is listed
        expect(await screen.findByText(/100mg/i)).toBeInTheDocument();
    });

    // Negative Test Case 1: Shows message when no patient data is found
    test('shows message when no patient data is found', async () => {
        getDoc.mockResolvedValue(mockEmptyPatientData); // Mock Firestore to return no patient data

        render(
            <MemoryRouter initialEntries={['/medications/patient123']}>
                <Routes>
                    <Route path="/medications/:id" element={<Medications />} />
                </Routes>
            </MemoryRouter>
        );

        // Check error message when no patient data exists
        expect(await screen.findByText(/Patient document does not exist./)).toBeInTheDocument(); 
    });

    // Positive Test Case 2: Updates medication details successfully
    test('updates medication details successfully', async () => {
        const mockPatientData = {
            exists: () => true,
            data: () => ({
                Name: 'Jane Doe',
                dateOfBirth: { seconds: 631152000 }, // Example DOB (1990-01-01)
                gender: 'Female',
                medications: [{ label: 'Aspirin', dosage: '100mg' }],
            }),
        };
        
        // Mock Firestore patient data retrieval
        getDoc.mockResolvedValue(mockPatientData);

        render(
            <MemoryRouter initialEntries={['/medications/patient123']}>
                <Routes>
                    <Route path="/medications/:id" element={<Medications />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure loading has finished
        await waitFor(() => expect(screen.queryByText(/Loading patient data.../i)).not.toBeInTheDocument());

        // Find patient details
        await screen.findByText((content, element) => 
            content.includes('Jane') && content.includes('Doe')
        );

        // Fill out the form fields using placeholder texts
        const medicineInputs = screen.getAllByPlaceholderText(/Medicine/i);
        fireEvent.change(medicineInputs[0], {
            target: { value: 'Paracetamol' },
        });

        const dosageInputs = screen.getAllByPlaceholderText(/Dosage of Medicine/i);
        fireEvent.change(dosageInputs[0], {
            target: { value: '500mg' },
        });

        // Click the submit button
        fireEvent.click(screen.getByText(/Submit/i));

        // Verify the update was called
        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalled(); // Check if updateDoc was called
        });
    });

    // Positive Test Case 3: Displays loading message while fetching data
    test('displays loading message while fetching data', () => {
        getDoc.mockReturnValue(new Promise(() => { })); // Simulate loading state

        render(
            <MemoryRouter initialEntries={['/medications/patient123']}>
                <Routes>
                    <Route path="/medications/:id" element={<Medications />} />
                </Routes>
            </MemoryRouter>
        );

        // Loading message should be shown
        expect(screen.getByText(/Loading patient data/i)).toBeInTheDocument(); 
    });

    // Negative Test Case 2: Blocks submission without a dosage
    test('blocks submission without a dosage', async () => {
        const mockPatientData = {
            exists: () => true,
            data: () => ({
                Name: 'Jane Doe',
                medications: [],
            }),
        };

        getDoc.mockResolvedValue(mockPatientData);

        render(
            <MemoryRouter initialEntries={['/medications/patient123']}>
                <Routes>
                    <Route path="/medications/:id" element={<Medications />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.queryByText(/Loading patient data.../i)).not.toBeInTheDocument());

        fireEvent.click(screen.getByText(/Add Medication/i));

        const medicineInputs = await screen.findAllByPlaceholderText(/Medicine/i);
        fireEvent.change(medicineInputs[0], { target: { value: 'Ibuprofen' } });
        fireEvent.click(screen.getByText(/Submit/i));

        // Check that alert is called for missing dosage
        expect(alert).toHaveBeenCalledWith('All dosage fields must be filled.');
        expect(updateDoc).not.toHaveBeenCalled();
    });
});
