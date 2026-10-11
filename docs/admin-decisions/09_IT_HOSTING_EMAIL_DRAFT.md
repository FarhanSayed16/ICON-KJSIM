# Email Draft — IT Hosting Request (ICON Website)

**How to use:** Copy from **Subject** downward into your college email.  
Fill the bracketed parts. Add CC as needed.

---

**To:** [IT Department email / IT Head email]  

**Cc:**  
[Faculty Mentor]  
[ICON Faculty Coordinator / Programme Chair if applicable]  
[Student Council / Cultural / Techfest coordinating office if applicable]  
[Your senior admin / HOD copy if required]  

**Subject:** Request for hosting support — Official ICON Techfest website on college infrastructure  

---

Respected Sir/Madam,

I am writing on behalf of the ICON Organising Committee, K J Somaiya Institute of Management, to request hosting support from the IT Department for the **official ICON techfest website**.

We will **design and develop** the website on our side. Once the site is complete and tested, we request the IT Department to kindly **allot hosting space / server resources** on the college infrastructure so that the website can go live under the Somaiya / KJSIM hosted environment.

### Purpose of the website
The website will be used to:
- Share ICON information, schedule, and event details with students  
- Enable **online registration** for fest events  
- Store registration data securely  
- Send confirmation emails to participants  

### Preferred domain
If feasible, we kindly request the subdomain:  
**`icon.somaiya.edu`**  

If this is not possible under university DNS, we request any suitable subdomain allotted by IT (for example under the KJSIM domain).

### Hosting support requested
As discussed, we understand IT may support hosting via college server (Linux/Windows), AWS, Nginx, or similar. For planning, we request guidance/support on:

1. Hosting environment for a **Node.js (Next.js)** web application  
2. Reverse proxy / web gateway (**Nginx** or equivalent) with **HTTPS**  
3. DNS mapping for the allotted subdomain + SSL certificate  
4. Required firewall / network access for the website to run properly  
5. Database connectivity approach as approved by IT (external managed DB or college-hosted, as per policy)  
6. Email delivery approach as approved by IT (college SMTP or approved external email service)  

### Deployment process (as per IT guidance)
We understand and agree that deployment access will be provided on a **controlled, one-time basis**:

- We will complete development and thorough testing on our side first  
- We will push / deploy the final tested website **once** to the allotted hosting environment, as per IT instructions  
- After successful deployment, **access from the student side will be removed**, so that no further direct changes or tampering can be done from our end  

We fully respect this security practice and will ensure the website is stable, tested, and deployment-ready before the final push.

### What we will deliver before go-live
- Fully developed and tested website build  
- Required configuration details (as asked by IT)  
- Coordination for domain, SSL, and go-live checks with the IT team  

### Kind request
We request the IT Department to please:
- Confirm whether hosting support can be provided  
- Advise the approved hosting option and subdomain  
- Share the process / checklist for the one-time deployment  
- Inform any approvals, forms, or timelines we should follow  

We are happy to discuss this in a short meeting and will follow all IT security and college policies.

Thank you for your support and guidance.

Warm regards,  

**[Your Full Name]**  
ICON Student Admin / Web Coordinator  
K J Somaiya Institute of Management  
Mobile: **[Your Number]**  
Email: **[Your College Email]**  

Faculty Mentor (if applicable): **[Name, Designation]**  

---

## Suggested CC list (edit as per your college)

- Faculty mentor for ICON  
- Faculty in-charge / programme coordinator  
- Department office (if they asked to stay in loop)  
- Senior student admin (optional)  
- Do **not** CC too many people; keep it to decision-makers + mentors  

## Note for you (do not put in email)

After go-live, event/content updates can be handled through the **website admin panel** (no server access needed). Keep that internal; IT email should only discuss hosting + one-time deploy.
