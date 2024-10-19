import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, addDoc } from 'firebase/firestore'; // Import updateDoc for updating issued medicines
import { db } from '../firebase';
import Nav from './pharmacyNav';
import './phStyle.css'; // Ensure this CSS file is created for styles

const PatientPrescriptions = () => {
    const { id } = useParams(); // Fetching the ID from the URL
    const [allMedications, setAllMedications] = useState([]); // Array for medications
    const [loading, setLoading] = useState(true);
    const [selectedMedications, setSelectedMedications] = useState([]); // Store medications for selected date
    const [patientName, setPatientName] = useState(''); // State to hold patient name
    const [patientAge, setPatientAge] = useState(''); // State to hold patient age
    const [patientId, setpatientId] = useState(''); // State to hold patient age
    const [billDetails, setBillDetails] = useState(null); // State to hold bill details
    const [patientExists, setPatientExists] = useState(true); // Default true, assuming it exists initially
    const [warning, setWarning] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [isMedicineIssued, setIsMedicineIssued] = useState(false); // Track whether medicines have been issued

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                //console.log(`Fetching data for Patient ID: ${id}`);

                const patientDoc = await getDoc(doc(db, 'Patients', id));
                if (patientDoc.exists()) {
                    const patientData = patientDoc.data();
                    //console.log("Patient document:", patientData);

                    setPatientName(patientData.Name);
                    setPatientAge(patientData.Age);
                    setpatientId(patientData.patientId);

                    if (Array.isArray(patientData.medications)) {
                        setAllMedications(patientData.medications);
                    } else {
                        console.warn("Medications data is not an array:", patientData.medications);
                        setAllMedications([]);
                    }
                } else {
                    //console.log("Patient document does not exist.");
                    setPatientExists(false); // Set patientExists to false when the document does not exist
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDateClick = (date) => {
        const filteredMedications = allMedications.filter(entry => entry.date === date);
        setSelectedMedications(filteredMedications); // Set medications for the selected date
        setBillDetails(null); // Reset bill details when a new date is selected
        setIsPaid(false); // Reset payment status when a new date is selected
        setIsMedicineIssued(false); // Reset issued medicine status when a new date is selected
    };

    // Function to generate a unique prescription ID
    const generatePrescriptionId = () => {
        return `PRES-${Date.now()}`; // Simple unique ID using the current timestamp
    };

    // Function to handle bill generation
    const handleGenerateBill = async () => {
        if (selectedMedications.length > 0) {
            const medications = selectedMedications[0].medications; // Get medications from the first selected prescription
            const billItems = []; // To hold the details for the bill

            // Fetch prices for each medication
            for (const med of medications) {
                const medicineQuery = await getDocs(collection(db, 'Medicines'));
                const medicineData = medicineQuery.docs.find(doc => doc.data().medicineName === med.label); // Match by medicine name

                if (!medicineData) {
                    setWarning(`Invalid data for medication: ${med.label}`);
                    return;
                }

                if (medicineData) {
                    const medicineInfo = medicineData.data();
                    const storedPrice = parseFloat(medicineInfo.price); // Convert price to float
                    const storedDosage = parseFloat(medicineInfo.dosage); // Convert dosage to float (in mg)

                    // Assuming med.dosage is in a format like "2000 mg"
                    const prescribedDosage = parseFloat(med.dosage.split(" ")[0]); // Extract numerical part from prescribed dosage

                    // Check if stored price and dosage are valid before calculating
                    if (!isNaN(storedPrice) && !isNaN(storedDosage) && !isNaN(prescribedDosage)) {
                        // Calculate unit price (per mg)
                        const unitPrice = storedPrice / storedDosage; // Price per mg
                        // Calculate total price based on prescribed dosage
                        const totalPrice = unitPrice * prescribedDosage;

                        billItems.push({
                            name: med.label,
                            // dosage: med.dosage,
                            unitPrice: unitPrice.toFixed(2), // Format unit price to 2 decimal places
                            prescribedDosage: prescribedDosage, // Include the prescribed dosage if needed
                            totalPrice: totalPrice.toFixed(2) // Format total price to 2 decimal places
                        });
                    } else {
                        console.warn(`Invalid data for medication: ${med.label}`); // Log warning for invalid data
                    }
                }
            }

            const totalBillPrice = billItems.reduce((total, item) => total + (parseFloat(item.totalPrice) || 0), 0); // Calculate grand total

            const prescriptionId = generatePrescriptionId();
            
            const bill = {
                patientName: patientName,
                patientAge: patientAge,
                patientId: patientId,
                date: selectedMedications[0].date,
                medications: billItems,
                totalPrice: totalBillPrice.toFixed(2), // Format total price to 2 decimal places
                prescriptionId: prescriptionId
            };
            setBillDetails(bill); // Set bill details state to render
        }
    };

    // Function to handle payment through app
    const handlePayThroughApp = async () => {
        try {
            const paymentData = {
                name: patientName,
                patientId: patientId, // Assuming id is the health card number
                date: new Date().toLocaleDateString(), // Current date
                totalValue: billDetails.totalPrice, // Total bill value
                description: 'pharmacy payment through app',
                status: 'not paid', // Initial status for app payment
                prescriptionId: billDetails.prescriptionId
            };

            await addDoc(collection(db, 'Payments'), paymentData); // Add document to "Payments" collection
            //console.log("Payment details saved successfully:", paymentData);
            alert("Payment directed to app.");
            setIsPaid(true);
        } catch (error) {
            console.error("Error saving payment details:", error);
        }
    };

    // Function to handle cash payment
    const handlePayByCash = async () => {
        try {
            const paymentData = {
                name: patientName,
                patientId: patientId, // Assuming id is the health card number
                date: new Date().toLocaleDateString(), // Current date
                totalValue: billDetails.totalPrice, // Total bill value
                description: 'pharmacy payment cash',
                status: 'paid', // Directly mark as paid
                prescriptionId: billDetails.prescriptionId
            };

            await addDoc(collection(db, 'Payments'), paymentData); // Add document to "Payments" collection
            //console.log("Payment completed with cash:", paymentData);
            alert("Payment completed with cash.");
            setIsPaid(true);
        } catch (error) {
            console.error("Error completing cash payment:", error);
        }
    };

    // Function to issue medicines and save bill details
// Function to issue medicines and save bill details
const handleIssueMedicine = async () => {
    try {
        // Step 1: Check payment status for the respective prescriptionId
        const paymentQuery = await getDocs(collection(db, 'Payments'));
        const paymentRecord = paymentQuery.docs.find(doc => doc.data().prescriptionId === billDetails.prescriptionId);

        if (paymentRecord) {
            const paymentData = paymentRecord.data();
            if (paymentData.status !== 'paid') {
                alert("Payment has not been made. Please complete the payment before issuing medicines.");
                return; // Exit the function if payment is not completed
            }
        } else {
            alert("No payment record found for this prescription. Please check the details.");
            return; // Exit the function if no payment record exists
        }

        // Step 2: Save issued prescription data
        const issuedPrescriptionData = {
            patientName: patientName,
            // patientAge: patientAge,
            patientId: patientId, // Assuming id is the health card number
            date: new Date().toLocaleDateString(), // Save the current date
            totalPrice: billDetails.totalPrice, // Save the total price of the bill
            prescriptionId: billDetails.prescriptionId, // Save the unique prescription ID
            medications: billDetails.medications, // Save the list of medications in the bill
        };

        await addDoc(collection(db, 'IssuedPrescriptions'), issuedPrescriptionData);

        // Step 3: Set the state to indicate the medicines are issued
        setIsMedicineIssued(true);
        alert("Medicines issued and prescription saved successfully.");
    } catch (error) {
        console.error("Error issuing medicines and saving prescription:", error);
    }
};



    if (loading) {
        return <div>Loading medications ...</div>;
    }

    // Check if no patient data exists
    if (!patientExists) {
        return <p>Patient document does not exist.</p>;
    }

    return (
        <div>
            <Nav />
            <h3 className='topic'>Prescription Details for {patientName}</h3>
            <div className="prescription-container">
                <div className="date-list">
                    <ul>
                        {allMedications.map((entry, index) => (
                            <li key={index}>
                                <span onClick={() => handleDateClick(entry.date)}>
                                    {new Date(entry.date).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="medication-details">
                    {selectedMedications.length > 0 ? (
                        selectedMedications.map((entry, index) => (
                            <div key={index} className="medication-info">
                                <h4>Medications for {new Date(entry.date).toLocaleDateString()}</h4>
                                <ul>
                                    {Array.isArray(entry.medications) && entry.medications.length > 0 ? (
                                        entry.medications.map((med, idx) => (
                                            <li key={idx}>
                                                {med.label} - {med.dosage}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No medications recorded.</li>
                                    )}
                                </ul>
                                <button
                                    onClick={handleGenerateBill} // Call bill generation function
                                    className="phbtn"
                                >
                                    Generate Bill
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Please select a date to view medication details.</p>
                    )}
                </div>
            </div>

            {/* Render Bill Details directly below the medications */}
            {warning && <div className="warning-message">{warning}</div>} {/* Render warning message */}
            {billDetails && (
                <div className="bill-details">
                    <div className="bill-header">
                        <div>Name: {billDetails.patientName}</div>
                        <div>Health Card Number : {billDetails.patientId}</div>
                        <div>Age: {billDetails.patientAge}</div>
                        <div>Date: {new Date().toLocaleDateString()}</div>
                        <div>Prescription ID: {billDetails.prescriptionId}</div> {/* Display Prescription ID */}
                    </div>
                    <table className="bill-table">
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Dose</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billDetails.medications.map((med, idx) => (
                                <tr key={idx}>
                                    <td>{med.name}</td>
                                    <td>{med.prescribedDosage} mg</td>
                                    <td style={{ textAlign: 'right' }}> Rs. {med.unitPrice}</td>
                                    <td style={{ textAlign: 'right' }}> Rs. {med.totalPrice}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan='3' style={{ textAlign: 'right' }}> <strong>Total Price </strong>
                                </td>
                                <td className="bill-total" style={{ textAlign: 'right' }}> <strong> Rs. {billDetails.totalPrice} </strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="payment-options">
                        <button
                            onClick={handlePayByCash}
                            className="phbtn"
                            disabled={isPaid} // Disable button if payment is done
                        >
                            Pay by Cash
                        </button>
                        <button
                            onClick={handlePayThroughApp}
                            className="phbtn"
                            disabled={isPaid} // Disable button if payment is done
                        >
                            Pay through App
                        </button>
                    </div>
                    {/* Issue Medicine Button */}
                    {isPaid && !isMedicineIssued && (
                        <div className="issue-medicine">
                            <button onClick={handleIssueMedicine} className="phbtn">
                                Issue Medicine
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientPrescriptions;
