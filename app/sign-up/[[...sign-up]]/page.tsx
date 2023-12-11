"use client";
import PlanCard from "@/app/components/PlanCard";
import { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { SignUp } from "@clerk/nextjs";
import Logo from "@/app/assets/img/481271_simple_plain_black_robot_shadow_with_white_backrou_xl-1024-v1-0.png";

function createOrder() {
  // replace this url with your server
  return fetch(
    "https://react-paypal-js-storybook.fly.dev/api/paypal/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: [
          {
            sku: "1blwyeo8",
            quantity: 2,
          },
        ],
      }),
    }
  )
    .then((response) => response.json())
    .then((order) => {
      // Your code here after create the order
      return order.id;
    });
}
function onApprove(data: any) {
  // replace this url with your server
  return fetch(
    "https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }
  )
    .then((response) => response.json())
    .then((orderData) => {
      console.log(orderData);
      // Your code here after capture the order
    });
}

const style = { layout: "vertical" };

const ButtonWrapper = ({ showSpinner }: { showSpinner: boolean }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <div className="inline-flex justify-center w-1/2">
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        // style={style}
        disabled={false}
        forceReRender={[style]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
        className="w-full"
      />
    </div>
  );
};

export default function SignUpPage() {
  const [planPage, setPlanPage] = useState<null | number>(null);
  return (
    <div className="flex justify-center px-0 md:px-52 items-center py-24 h-[calc(100vh-10rem)]">
      <SignUp />
    </div>
  );
  if (!planPage) {
    return (
      <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white ">
              Designed for business teams like yours
            </h2>
            <p className="mb-5 font-light text-gray-300 sm:text-xl ">
              Here at Flowbite we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            <PlanCard changePlan={() => setPlanPage(30)} money={30} />
            <PlanCard changePlan={() => setPlanPage(60)} money={20} />
            <PlanCard changePlan={() => setPlanPage(90)} money={15} />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <div className="flex justify-center gap-10 items-center min-h-[calc(100vh-10rem)]">
        <div
          className="w-1/2 flex flex-col items-center justify-center gap-5 h-[calc(100vh-15rem)] rounded-xl"
          style={{ backgroundImage: `url(${Logo.src})` }}
        >
          <div className="w-1/2 flex flex-col items-center justify-center gap-5 rounded-xl bg-slate-100 backdrop-blur-md bg-opacity-5 py-5">
            <h1 className="text-6xl mb-5">${planPage}</h1>
            <PayPalScriptProvider
              options={{
                clientId: "test",
                components: "buttons",
                currency: "USD",
              }}
            >
              <ButtonWrapper showSpinner={false} />
            </PayPalScriptProvider>
          </div>
        </div>
        <div>
          <SignUp />
        </div>
      </div>
    );
  }
}
