import {useState} from 'react';
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { z } from 'zod';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccountMutation, useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

const SignupForm = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const{ mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccountMutation();

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();


  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: "",
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    
    if (!newUser){
      return toast({
        title: "Sign-Up Failed! , Try Again!",
      })
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({title: 'Sign in Failed! Please Try Again.'})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/')
    } else {
      return toast({title: 'Sign Up Failed! Please Try Again.'});
    }
  }
  
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  }; 

  const handleBlur = () => {
    setFocusedField(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a New Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram, Please Enter Your Account Detail</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder={focusedField === 'name' ? '' : 'Enter Your Name'}
                    onFocus={() => handleFocus('name')}
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                {focusedField === 'name' && <FormDescription>This is your public display name.</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder={focusedField === 'username' ? '' : 'Enter Your Username'}
                    onFocus={() => handleFocus('username')}
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                {focusedField === 'username' && <FormDescription>This is your public display username.</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="shad-input"
                    placeholder={focusedField === 'email' ? '' : 'Enter Your Email'}
                    onFocus={() => handleFocus('email')}
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    className="shad-input"
                    placeholder={focusedField === 'password' ? '' : 'Enter Your Password'}
                    onFocus={() => handleFocus('password')}
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <div className="show-password-container">
                  <input
                    type="checkbox"
                    id="showPasswordCheckbox"
                    onChange={toggleShowPassword}
                    checked={showPassword}
                  />
                  <label htmlFor="showPasswordCheckbox" className="show-password-label">
                    Show Password
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='shad-button_primary'>{isCreatingAccount ? (<div className='flex-center gap-2'><Loader/> Loading...</div>) : "Sign-up"}</Button>
          <p className='text-small-regular text-light-2 text-center mt-2'>
            Already have an account?
            <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'>Log In</Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignupForm;


