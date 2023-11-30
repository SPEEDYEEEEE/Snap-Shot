import {useState} from 'react';
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
import { z } from 'zod';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    
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
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log-in to your Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome Back! Please Enter Your Account Detail</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          
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
          <Button type="submit" className='shad-button_primary'>{isUserLoading ? (<div className='flex-center gap-2'><Loader/> Loading...</div>) : "Sign-in"}</Button>
          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don't have an account?
            <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'>Sign Up</Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SigninForm;


