// testCases for PatientDetails.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientPrescriptions from '../PatientDetails'; 77777777
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getDoc, getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore');

const mockPatientData = {
    exists: () => true,
    data: () => ({
        Name: 'John Doe',
        patientId: 'patient123',
        medications: [
            { date: '2023-10-10', medications: [{ label: 'Aspirin', dosage: '500 mg' }] },
            { date: '2023-10-15', medications: [{ label: 'Paracetamol', dosage: '1000 mg' }] }
        ]
    })
};

const mockEmptyPatientData = {
    exists: () => false
};

const mockMedicineData = [
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

    // Test 3: displays medications for selected date
    test('displays medications for selected date', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore to return no patient data

        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByText(/10\/10\/2023/i));
        });

        expect(screen.getByText(/Medications for 10\/10\/2023/i)).toBeInTheDocument();
        expect(screen.getByText(/Aspirin - 500 mg/i)).toBeInTheDocument();
    });

    // Test 4: Generates bill for selected medications
    test('generates bill for selected medications', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data
        getDocs.mockResolvedValue({ docs: mockMedicineData }); // Mock Firestore medicines collection

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

    // Test 5: Shows warning when invalid medication data is found
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

    // Test 6: Displays loading message while fetching data
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

    // Test 7: Handles cash payment
    test('handles cash payment', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data
        getDocs.mockResolvedValue({ docs: mockMedicineData }); // Mock Firestore medicines collection

        // Mock window.alert to track if it's called
        const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Render the component
        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByText('10/10/2023')); // Select date
        fireEvent.click(screen.getByText(/Generate Bill/i)); // Generate bill

        // Use findAllByText to get all instances of Rs. 50.00
        const priceElements = await screen.findAllByText(/Rs. 50.00/i);

        // Assert that the total price element is displayed
        expect(priceElements[1]).toBeInTheDocument(); // Assuming the second element is the total

        // Ensure the "Pay by Cash" button is enabled
        const payByCashButton = screen.getByText(/Pay by Cash/i);
        expect(payByCashButton).not.toBeDisabled(); // Ensure it's enabled before clicking

        fireEvent.click(payByCashButton); // Click 'Pay by Cash'

        // Check if the alert for payment completion is triggered
        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith('Payment completed with cash.');
        });

        // Restore the original window.alert behavior after the test
        mockAlert.mockRestore();
    });

    // Test 8: Handles payment through app
    test('handles payment through app', async () => {
        getDoc.mockResolvedValue(mockPatientData); // Mock Firestore patient data
        getDocs.mockResolvedValue({ docs: mockMedicineData }); // Mock Firestore medicines collection

        // Mock window.alert to track if it's called
        const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Render the component
        render(
            <MemoryRouter initialEntries={['/prescriptions/patient123']}>
                <Routes>
                    <Route path="/prescriptions/:id" element={<PatientPrescriptions />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByText('10/10/2023')); // Select date
        fireEvent.click(screen.getByText(/Generate Bill/i)); // Generate bill

        // Use findAllByText to get all instances of Rs. 50.00
        const priceElements = await screen.findAllByText(/Rs. 50.00/i);

        // Assert that the total price element is displayed
        expect(priceElements[1]).toBeInTheDocument(); // Assuming the second element is the total

        // Ensure the "Pay by Cash" button is enabled
        const payButton = screen.getByText(/Pay through App/i);
        expect(payButton).not.toBeDisabled(); // Ensure it's enabled before clicking

        fireEvent.click(payButton); // Click 'Pay by Cash'

        // Check if the alert for payment completion is triggered
        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith('Payment directed to app.');
        });

        // Restore the original window.alert behavior after the test
        mockAlert.mockRestore();
    });


});
