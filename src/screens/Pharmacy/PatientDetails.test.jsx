import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientPrescriptions from './PatientDetails'; // Adjust the path as necessary
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary

jest.mock('firebase/firestore');

// Mock patient data
const mockPatientData = {
    exists: () => true,
    data: () => ({
        Name: 'John Doe',
        medications: [
            { date: '2023-10-10', medications: [{ label: 'Aspirin', dosage: '500 mg' }] },
            { date: '2023-10-15', medications: [{ label: 'Paracetamol', dosage: '1000 mg' }] }
        ]
    })
};

// Mock empty patient data (for negative cases)
const mockEmptyPatientData = {
    exists: () => false
};

// Mock valid medication data
const mockMedicineDocs = [
    { data: () => ({ medicineName: 'Aspirin', price: '50', dosage: '500' }) }
];

describe('PatientPrescriptions Component', () => {
    // Test 1: Renders patient name and prescription dates
    test('renders patient name and prescription dates', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data

        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/Prescription Details for John Doe/i)).toBeInTheDocument(); // Check patient name
        expect(await screen.findByText(/10\/10\/2023/i)).toBeInTheDocument(); // Check first prescription date
        expect(await screen.findByText(/10\/15\/2023/i)).toBeInTheDocument(); // Check second prescription date
    });

    // Test 2: Shows message when no patient data is found
    test('shows message when no patient data is found', async () => {
        getDoc.mockResolvedValue(mockEmptyPatientData); // Mock Firestore to return no patient data

        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText(/Patient document does not exist./)).toBeInTheDocument(); // Check patient name
    });

    // Test 3: Generates bill for selected medications
    test('generates bill for selected medications', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data
        getDocs.mockResolvedValue({ docs: mockMedicineDocs }); // Mock Firestore medicines collection

        const { container } = render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        const dateElement = await screen.findByText('10/10/2023');
        fireEvent.click(dateElement); // Simulate clicking on a prescription date

        const generateBillButton = screen.getByText(/Generate Bill/i);
        fireEvent.click(generateBillButton); // Simulate clicking on 'Generate Bill'

        await waitFor(() => {
            expect(container.querySelector('.bill-details')).toBeInTheDocument();
        });

        // Get the total price cell
        const totalPriceCell = container.querySelector('.bill-total');
        expect(totalPriceCell).toBeInTheDocument();

        // Normalize the text content to remove extra whitespace
        const totalPriceText = totalPriceCell.textContent.replace(/\s+/g, ' ').trim();

        // Check that the total price text is as expected
        expect(totalPriceText).toBe('Rs. 50.00');
    });

    // Test 4: Shows warning when invalid medication data is found
    test('shows warning when invalid medication data is found', async () => {
        const mockInvalidPatientData = {
            exists: () => true,
            data: () => ({
                Name: 'John Doe',
                Age: '45',
                medications: [
                    { date: '2023-10-10', medications: [{ label: 'InvalidMed', dosage: '500 mg' }] }
                ]
            })
        };
        getDoc.mockResolvedValue(mockInvalidPatientData); // Mock invalid medication data
        getDocs.mockResolvedValue({ docs: [] }); // Return empty medicines collection

        const { container } = render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        const dateElement = await screen.findByText('10/10/2023');
        fireEvent.click(dateElement); // Click on the date

        const generateBillButton = screen.getByText(/Generate Bill/i);
        fireEvent.click(generateBillButton); // Click on 'Generate Bill'

        expect(await screen.findByText(/Invalid data for medication: InvalidMed/i)).toBeInTheDocument(); // Check for invalid medication warning
    });

    // Test 5: Displays loading message while fetching data
    test('displays loading message while fetching data', () => {
        getDoc.mockReturnValue(new Promise(() => { })); // Simulate loading state

        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading medications/i)).toBeInTheDocument(); // Loading message should be shown
    });

    test('does not display loading message after data is loaded', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock resolved patient data
    
        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );
    
        // Wait for the loading message to disappear
        await waitFor(() => {
            expect(screen.queryByText(/Loading medications/i)).not.toBeInTheDocument(); // Check that loading message is gone
        });
    });
    
});
