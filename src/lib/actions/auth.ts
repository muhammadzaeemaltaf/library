"use server";

import { eq } from "drizzle-orm";
import { db } from "../../../database/drizzle";
import { users } from "../../../database/schema";
import { hash } from "bcryptjs";
import { signIn } from "../../../auth";
import { headers } from "next/headers";
import ratelimit from "../rateLimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<AuthCredientials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = ((await headers()).get('x-forword-for') || '127.0.0.1')
  const {success} = await ratelimit.limit(ip)

  if (!success) return redirect('/too-fast')

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result,
    };


  } catch (error) {
    console.error(error, "Sign in error");
    return {
      success: false,
      error: "Sign in error",
    };
  }
};

export const signUp = async (params: AuthCredientials) => {
  const { email, fullName, password, universityCard, universityId } = params;

  const ip = ((await headers()).get('x-forword-for') || '127.0.0.1')
  const {success} = await ratelimit.limit(ip)

  if (!success) return redirect('/too-fast')

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "User already exists",
    };
  }

  const hasedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hasedPassword,
      universityCard,
      universityId,
    }); 

    await signInWithCredentials({ email, password });

    return { success: true };

  } catch (error) {
    console.error(error, "Sign up error");
    return {
      success: false,
      error: "Sign up error",
    };
  }
};
