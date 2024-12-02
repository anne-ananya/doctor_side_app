import emailjs from "@emailjs/react-native";

const sendEmail = async (formData) => {
  const serviceID = "service_i30lp2s";
  const templateID = "template_t4tc4gn";
  const publicKey = "FrVKq_XkX0_89Kfiu";
  const privateKey = "lVmYe8nsLCJT16ub4o_VF";

  const templateParams = {
    patient_name: formData.patientName,          // Matches {{to_name}}
    patient_email: formData.patientEmail,  // Not directly used in the template
    from_name: "DoctorApp",                // Not directly used in the template
    doctor_email: "ananya0612de@gmail.com",// Not directly used in the template
    appointmentDate: formData.appointmentDate, // Matches {{appointmentDate}}
    patientDisease: formData.patientDisease,   // Matches {{patientDisease}}
    prescription: formData.prescription, 
  };
  console.log("Sending templateParams:", templateParams);
  try {
    const response = await emailjs.send(
      serviceID,
      templateID,
      templateParams,
      {
        publicKey,
        privateKey,
      }
    );

    console.log("SUCCESS!", response.status, response.text);
    alert("Email sent successfully!");
  } catch (err) {
    console.error("FAILED...", err);
    alert("Failed to send email. Please try again.");
  }
};

export default sendEmail;
