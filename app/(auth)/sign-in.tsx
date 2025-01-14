import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, StyleSheet } from 'react-native'
import React from 'react'

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

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
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

  const handleEmailChange = React.useCallback((email: string) => {
    setEmailAddress(email)
    validateEmail(email)
  }, [])

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return
    setErrorMessage('')

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(authenticated)/(tabs)/boards') // Updated navigation path
      } else {
        setErrorMessage('Unable to sign in. Please check your credentials.')
      }
    } catch (err) {
      const clerkError = err as ClerkError
      if (clerkError.errors?.[0]) {
        const error = clerkError.errors[0]
        switch (error.code) {
          case 'form_param_format_invalid':
            setEmailError('Please enter a valid email address')
            break
          case 'form_identifier_not_found':
            setErrorMessage('No account found with this email')
            break
          case 'form_password_incorrect':
            setErrorMessage('Incorrect password')
            break
          default:
            setErrorMessage(error.message || 'An error occurred. Please try again.')
        }
      }
      console.error('Sign in error:', err)
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View style={styles.container}>
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
        title="Sign in" 
        onPress={onSignInPress}
        disabled={!isValid || !password} 
      />
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <Link href="/sign-up">
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: 'blue',
  },
})