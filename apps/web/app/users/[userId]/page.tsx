"use client";

import { authClient } from "@/lib/auth/client";
import { trpc } from "@/lib/trpc/client";
import { UpdateProfileInput } from "@repo/trpc/schemas";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { data: session } = authClient.useSession();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const utils = trpc.useUtils();

  const { data: profile, isLoading } = trpc.usersRouter.getUserProfile.useQuery(
    {
      userId,
    },
  );


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">This user doesn`t exist</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      User Page
    </div>
  );
}
