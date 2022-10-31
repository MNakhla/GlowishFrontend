import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

export default function Payment(props) {
  const {
    clientSecret,
    handleSubmitAppointment,
    summaryComponent,
    handleBack,
    showDialog,
    setShowDialog,
    stripePromise,
    setActiveStep,
  } = props;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        // passing the client secret obtained from the server
        clientSecret: clientSecret,
        loader: "always",
      }}
    >
      <CheckoutForm
        handleSubmitAppointment={handleSubmitAppointment}
        summaryComponent={summaryComponent}
        handleBack={handleBack}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        setActiveStep={setActiveStep}
      />
    </Elements>
  );
}
