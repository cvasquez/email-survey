# Testing Guide

## Prerequisites

Before testing, ensure:
- [x] Supabase project is created and database schema is applied
- [x] Environment variables are configured in `.env.local`
- [x] Development server is running (`npm run dev`)

## Test Scenarios

### 1. Authentication Flow

**Sign Up:**
1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Enter email and password (minimum 6 characters)
4. Submit form
5. **Expected**: Redirected to `/dashboard`

**Log In:**
1. Navigate to http://localhost:3000/login
2. Enter your credentials
3. Submit form
4. **Expected**: Redirected to `/dashboard`

**Log Out:**
1. From dashboard, click "Log Out"
2. **Expected**: Redirected to `/login`, session cleared

### 2. Survey Creation

**Basic Survey:**
1. Log in and navigate to `/dashboard`
2. Click "Create New Survey"
3. Enter title: "Product Feedback Survey"
4. Leave "Require respondent name" unchecked
5. Click "Create Survey"
6. **Expected**: Redirected to dashboard, new survey appears in list

**Survey with Name Requirement:**
1. Create another survey
2. Enter title: "Customer Satisfaction"
3. Check "Require respondent name"
4. Click "Create Survey"
5. **Expected**: Survey created with require_name = true

### 3. Survey Link Testing

**Copy Link:**
1. From dashboard, find your survey
2. Click "Copy Link"
3. **Expected**: Link copied to clipboard (format: `http://localhost:3000/s/[8-char-id]?answer=YOUR-ANSWER-HERE`)

**Test Link Format:**
Replace `YOUR-ANSWER-HERE` with different values:
- `very-satisfied` → displays "very satisfied"
- `needs-improvement` → displays "needs improvement"
- `first-time-user` → displays "first time user"

### 4. Public Response Submission

**Without Name (require_name = false):**
1. Open link: `http://localhost:3000/s/[survey-id]?answer=very-satisfied`
2. **Expected**:
   - Question displays: "Tell me about your answer: very satisfied"
   - No name field shown
3. Enter free response: "The product exceeded my expectations!"
4. Click "Submit Response"
5. **Expected**: Success message appears

**With Name (require_name = true):**
1. Open link for survey with name requirement
2. **Expected**: Name field is visible and required
3. Try submitting without name
4. **Expected**: Form validation prevents submission
5. Enter name and free response
6. Submit form
7. **Expected**: Success message appears

### 5. AWeber Integration Testing

**With hash_md5 Parameter:**
1. Open link: `http://localhost:3000/s/[survey-id]?answer=satisfied&hash_md5=test123abc`
2. Submit a response
3. Navigate to `/surveys/[id]/responses`
4. **Expected**: Response row shows "test123..." in Hash MD5 column

**Simulated AWeber URL:**
Test with multiple hash values to simulate different subscribers:
```
?answer=satisfied&hash_md5=subscriber1hash
?answer=dissatisfied&hash_md5=subscriber2hash
?answer=neutral&hash_md5=subscriber3hash
```

### 6. Response Visualization

**View Responses:**
1. From dashboard, click "Responses" for a survey
2. **Expected**: Table displays all responses with columns:
   - Timestamp
   - Answer Value
   - Free Response
   - Name (if required)
   - Hash MD5

**Filtering:**
1. Enter text in "Filter responses..." field
2. Try filtering by:
   - Answer value (e.g., "satisfied")
   - Part of free response text
   - Respondent name
   - Hash MD5
3. **Expected**: Table updates to show only matching responses

**CSV Export:**
1. Click "Export to CSV"
2. **Expected**: CSV file downloads with all response data
3. Open in Excel/Google Sheets
4. **Expected**: Properly formatted with headers and data

### 7. Edge Cases

**Inactive Survey:**
1. In Supabase dashboard, manually set a survey's `is_active` to `false`
2. Try to submit a response to that survey
3. **Expected**: Error message "Survey is not accepting responses"

**Invalid Survey ID:**
1. Navigate to `http://localhost:3000/s/invalid-id-here`
2. **Expected**: "Survey Not Found" error page

**Missing Answer Parameter:**
1. Navigate to `http://localhost:3000/s/[survey-id]` (no ?answer=)
2. **Expected**: Question displays: "Tell me about your answer: " (empty answer)
3. Response still submits successfully with empty answer_value

**Missing Required Name:**
1. On survey with require_name=true
2. Try submitting without entering name
3. **Expected**: Browser validation prevents submission

### 8. Security Testing

**Unauthorized Access:**
1. Log out
2. Try to access `/dashboard` directly
3. **Expected**: Redirected to `/login`

**Survey Ownership:**
1. Create survey as User A
2. Note the survey ID
3. Log in as User B
4. Try to access `/surveys/[user-a-survey-id]/responses`
5. **Expected**: "Survey not found" error (RLS prevents access)

**Public Response Form (No Auth):**
1. Log out completely
2. Open public survey link
3. **Expected**: Can view form and submit response without logging in

## Supabase Dashboard Verification

### Check Surveys Table:
1. Go to Supabase → Table Editor → surveys
2. Verify your created surveys appear
3. Check columns: id, user_id, title, unique_link_id, require_name, is_active

### Check Responses Table:
1. Go to Supabase → Table Editor → responses
2. Verify submitted responses appear
3. Check columns: survey_id, answer_value, free_response, respondent_name, hash_md5

### Verify RLS Policies:
1. Go to Supabase → Authentication → Policies
2. Confirm policies exist for both tables:
   - surveys: 4 policies (select, insert, update, delete)
   - responses: 2 policies (insert anyone, select owners)

## Common Issues

**Issue: Can't create account**
- Check Supabase Auth settings
- Verify email confirmation is disabled (or SMTP is configured)
- Check browser console for errors

**Issue: Responses not appearing**
- Verify you're logged in as the survey creator
- Check that survey_id in response matches survey id
- Verify RLS policies are active

**Issue: "Unauthorized" errors**
- Check environment variables are set correctly
- Verify Supabase keys are valid
- Clear browser cache and cookies

**Issue: Survey link doesn't work**
- Verify unique_link_id exists in database
- Check that survey is_active = true
- Ensure NEXT_PUBLIC_APP_URL is correct

## Performance Testing

**Multiple Responses:**
1. Submit 20+ responses to a single survey
2. Navigate to responses page
3. **Expected**: Responses load quickly, table scrolls properly

**Long Free Response:**
1. Submit response with 500+ characters
2. **Expected**: Text is truncated in table view with "..."
3. Full text should be visible in CSV export

**Special Characters:**
1. Submit response with quotes, commas, line breaks
2. Export to CSV
3. **Expected**: Properly escaped in CSV format

## Ready for Production?

Before deploying to Vercel:

- [ ] All authentication tests pass
- [ ] Survey creation and editing work
- [ ] Public response form accepts submissions
- [ ] AWeber hash_md5 integration works
- [ ] Response visualization displays correctly
- [ ] CSV export downloads properly
- [ ] RLS policies prevent unauthorized access
- [ ] Error handling works gracefully

Next step: Deploy to Vercel and test with real AWeber emails!
