import React from 'react';
import {fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import App from '../App';


test( 'renders without errors', () => {
  render( <App /> )
});

beforeEach(() => {
  render( <ContactForm /> )
} )

test('renders the contact form header', ()=> {
  screen.getByRole( 'heading' );
});

test( 'renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  fireEvent.change( screen.getByTestId( "firstName" ), { target: { value: "abc" } } );
  expect( screen.getByTestId( "error-firstName" ) ).toBeVisible();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  fireEvent.change( screen.getByTestId( "firstName" ), { target: { value: "abc" } } );
  fireEvent.change( screen.getByTestId( "firstName" ), { target: { value: "" } } );
  expect( screen.getByTestId( "error-firstName" ) ).toBeVisible();
  fireEvent.change( screen.getByTestId( "lastName" ), { target: { value: "abc" } } );
  fireEvent.change( screen.getByTestId( "lastName" ), { target: { value: "" } } );
  expect( screen.getByTestId( "error-lastName" ) ).toBeVisible();
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "abc" } } );
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "" } } );
  expect( screen.getByTestId( "error-email" ) ).toBeVisible();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  fireEvent.change( screen.getByTestId( "firstName" ), { target: { value: "abcdefgh" } } );
  const firstNameError = screen.queryByTestId( "error-firstName" );
  expect( firstNameError ).toBeNull();
  fireEvent.change( screen.getByTestId( "lastName" ), { target: { value: "abclkskdfs" } } );
  const lastNameError = screen.queryByTestId( "error-lastName" );
  expect( lastNameError ).toBeNull();
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "abc" } } );
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "" } } );
  expect( screen.getByTestId( "error-email" ) ).toBeVisible();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "lsdkjf.com" } } );
  waitFor( () => {
    expect( screen.queryByText( "email must be a valid email address" ) ).toBeVisible();
  } );
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  fireEvent(
    screen.getByTestId( "submit" ),
    new MouseEvent( 'click' ), {
      bubbles: true,
      cancelable: true,
  } );
  waitFor( () => {
    expect( screen.queryByText( "lastName is a required field" ) ).toBeVisible();
  } );
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  fireEvent.change( screen.getByTestId( "firstName" ), { target: { value: "abcdefgh" } } );
  fireEvent.change( screen.getByTestId( "lastName" ), { target: { value: "abclkskdfs" } } );
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "abcsdf@gmail.com" } } );

  fireEvent(
    screen.getByTestId( "submit" ),
    new MouseEvent( 'click' ), {
      bubbles: true,
      cancelable: true,
  } );

  waitFor( () => {
    expect( screen.queryByTestId( "firstnameDisplay" ) ).toBeVisible();
    expect( screen.queryByTestId( "lastnameDisplay" ) ).toBeVisible();
    expect( screen.queryByTestId( "emailDisplay" ) ).toBeVisible();
    const messageDisplay = screen.queryByTestId( "messageDisplay" );
    expect( messageDisplay ).toBeNull();
  } );
});

test('renders all fields text when all fields are submitted.', async () => {
  fireEvent.change( screen.getByTestId( "firstName" ), { target: { value: "abcdefgh" } } );
  fireEvent.change( screen.getByTestId( "lastName" ), { target: { value: "abclkskdfs" } } );
  fireEvent.change( screen.getByTestId( "email" ), { target: { value: "abcsdf@gmail.com" } } );
  fireEvent.change( screen.getByTestId( "message" ), { target: { value: "This is a message for you!" } } );

  fireEvent(
    screen.getByTestId( "submit" ),
    new MouseEvent( 'click' ), {
      bubbles: true,
      cancelable: true,
  } );

  waitFor( () => {
    expect( screen.queryByTestId( "firstnameDisplay" ) ).toBeVisible();
    expect( screen.queryByTestId( "lastnameDisplay" ) ).toBeVisible();
    expect( screen.queryByTestId( "emailDisplay" ) ).toBeVisible();
    expect( screen.queryByTestId( "messageDisplay" ) ).toBeVisible();
  } );
});