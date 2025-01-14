import * as React from 'react'
import { Text, TextInput, Button, View, StyleSheet } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

interface ClerkError {
  status: number;
  errors: Array<{
    code: string;
    message: string;
    longMessage: string;
    meta: {
      paramName?: string;
    };
  }>;
}

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [isValid, setIsValid] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      setIsValid(false)
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      setIsValid(false)
    } else {
      setEmailError('')
      setIsValid(true)
    }
  }

  const handleEmailChange = (email: string) => {
    setEmailAddress(email)
    validateEmail(email)
  }

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    setErrorMessage('')

    try {
      const response = await signUp.create({
        emailAddress: emailAddress.trim().toLowerCase(),
        password,
      })

      if (response.status === 'complete') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setPendingVerification(true)
      } else {
        setErrorMessage('Something went wrong. Please try again.')
      }
    } catch (err) {
      const clerkError = err as ClerkError
      if (clerkError.errors?.[0]) {
        const error = clerkError.errors[0]
        switch (error.code) {
          case 'form_param_format_invalid':
            setEmailError('Please enter a valid email address')
            break
          case 'form_identifier_exists':
            setEmailError('This email is already registered')
            break
          case 'strategy_for_user_invalid':
            setErrorMessage('Invalid verification method. Please try again.')
            break
          default:
            setErrorMessage(error.message || 'An error occurred. Please try again.')
        }
      }
      console.error('Sign up error:', err)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(authenticated)/(tabs)/boards') // Updated navigation path
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={handleEmailChange}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button 
        title="Continue" 
        onPress={onSignUpPress} 
        disabled={!isValid || !password || password.length < 8}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
})