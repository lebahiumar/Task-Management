
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Controlled state for forms
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowVerifyNotice(false);
    setShowResend(false);
    setResendSent(false);
    const { error } = await supabase.auth.signInWithPassword({
      email: signinEmail,
      password: signinPassword,
    });
    if (error) {
      setIsLoading(false);
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Check if email is verified
      const { data: userData, error: userError } = await supabase.auth.getUser();
      setIsLoading(false);
      if (userError || !userData?.user) {
        toast({
          title: "Sign In Failed",
          description: userError?.message || "Could not get user info.",
          variant: "destructive",
        });
        return;
      }
      const emailVerified =
        userData.user.email_confirmed_at ||
        userData.user.confirmed_at;
      if (emailVerified) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        window.location.href = "/dashboard";
      } else {
        setShowVerifyNotice(true);
        setShowResend(true);
        toast({
          title: "Email not verified",
          description: "Please verify your email before accessing the dashboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowVerifyNotice(false);
    setShowResend(false);
    setResendSent(false);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { full_name: signupName },
      },
    });
    setIsLoading(false);
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setShowVerifyNotice(true);
      setShowResend(true);
      toast({
        title: "Account created!",
        description: "Your account has been created successfully. Please check your email to confirm your account.",
      });
    }
  };

  // Resend verification email handler
  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSent(false);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: signinEmail || signupEmail,
    });
    setResendLoading(false);
    if (error) {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setResendSent(true);
      toast({
        title: "Verification Email Sent",
        description: "A new verification email has been sent.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 animate-scale-in">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Manage tasks, collaborate with teams</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showVerifyNotice && (
              <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-center">
                Please verify your email address to continue. Check your inbox for a verification link.
                {showResend && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                    >
                      {resendLoading ? "Resending..." : "Resend Verification Email"}
                    </Button>
                    {resendSent && (
                      <div className="text-green-600 text-sm mt-1">
                        Verification email sent!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={signinEmail}
                      onChange={(e) => setSigninEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
