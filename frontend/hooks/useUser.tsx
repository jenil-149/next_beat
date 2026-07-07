import { User } from "@supabase/supabase-js";
import { userDetails, subscription } from "@/frontend/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";

type userContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: userDetails | null;
    isLoading: boolean;
    subscription: subscription | null;
};

export const userContext = createContext<userContextType | undefined>(
    undefined
);

export interface Props {
    children: React.ReactNode;
}

export const MyUserContextProvider = (props: Props) => {
    const { children } = props;
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase,
    } = useSessionContext();

    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsloadingData] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<userDetails | null>(null);
    const [subscription, setSubscription] = useState<subscription | null>(null);

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            Promise.resolve().then(() => setIsloadingData(true));
            const getUserDetail = () => supabase.from("users").select("*").eq("id", user?.id).maybeSingle();
            const getSubscription = () =>
                supabase
                    .from("subscriptions")
                    .select("*, prices(*, products(*))")
                    .in("status", ["trialing", "active"])
                    .maybeSingle();

            Promise.allSettled([getUserDetail(), getSubscription()]).then(
                (results) => {
                    const userDetailPromise = results[0];
                    const subscriptionPromise = results[1];

                    if (userDetailPromise.status === "fulfilled") {
                        setUserDetails(userDetailPromise.value.data as userDetails);
                    }

                    if (subscriptionPromise.status === "fulfilled") {
                        setSubscription(subscriptionPromise.value.data as subscription);
                    }

                    setIsloadingData(false);
                }
            );
        } else if (!user && !isLoadingUser && !isLoadingData) {
            Promise.resolve().then(() => {
                setUserDetails(null);
                setSubscription(null);
            });
        }
    }, [user, isLoadingUser, isLoadingData, userDetails, subscription, supabase]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription,
    };

    return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export const useUser = () => {
    const context = useContext(userContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a MyUserContextProvider");
    }
    return context;
};