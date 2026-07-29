import { Box, Card, CardContent, Typography } from "@mui/material";
import Title from "@/app/components/title.components";

const policySections = [
  {
    title: "Information We Collect",
    content: "When you submit a job application, we may collect:",
    items: [
      "First Name and Last Name",
      "Email Address",
      "Phone Number (optional)",
      "About Me (optional)",
      "Cover Letter (optional)",
      "Resume/CV (if you choose to upload one)",
    ],
    note: "Providing optional information is entirely at your discretion.",
  },
  {
    title: "How We Use Information",
    content: "We use the information you provide only to:",
    items: [
      "Submit your application to the employer for the selected job.",
      "Allow employers to review your application.",
      "Contact you regarding your application, if necessary.",
      "Operate and maintain our job application service.",
    ],
  },
  {
    title: "Sharing Your Information",
    content:
      "The information you submit is shared only with the employer for the specific job you apply for. We do not sell or rent your personal information to third parties.",
  },
  {
    title: "Data Security",
    content:
      "We take reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, or misuse.",
  },
  {
    title: "Data Retention",
    content:
      "Your application data is retained only as long as necessary to process your application or comply with applicable legal obligations.",
  },
  {
    title: "Children's Privacy",
    content:
      "This application is intended for individuals seeking employment opportunities and is not directed at children under the age of 13.",
  },
  {
    title: "Changes to This Privacy Policy",
    content:
      "We may update this Privacy Policy from time to time. Any changes will be published on this page.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions regarding this Privacy Policy, please contact us:",
    items: ["Wohnbau Regional", "Email: stadtuni.app@googlemail.com"],
  },
];

const PrivacyPolicyPage = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1000px", mx: "auto" }}>
      <Title heading="Privacy Policy" />
      <Card
        elevation={0}
        sx={{ borderRadius: "10px", border: "1px solid #E5E7EB" }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Privacy Policy
          </Typography>
          <Typography sx={{ color: "#646464", mb: 2, lineHeight: 1.8 }}>
            Effective Date: July 29, 2026
          </Typography>
          <Typography sx={{ color: "#646464", mb: 4, lineHeight: 1.8 }}>
            Wohnbau Regional ("we", "our", or "us") values your privacy. This
            Privacy Policy explains how we collect and use the information you
            provide when submitting a job application through our mobile
            application.
          </Typography>

          <Box sx={{ display: "grid", gap: 3 }}>
            {policySections.map((section) => (
              <Box key={section.title}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {section.title}
                </Typography>
                <Typography sx={{ color: "#646464", lineHeight: 1.8 }}>
                  {section.content}
                </Typography>
                {section.items && (
                  <Box component="ul" sx={{ color: "#646464", my: 1, pl: 3 }}>
                    {section.items.map((item) => (
                      <Typography
                        key={item}
                        component="li"
                        sx={{ lineHeight: 1.8 }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                )}
                {section.note && (
                  <Typography sx={{ color: "#646464", lineHeight: 1.8 }}>
                    {section.note}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrivacyPolicyPage;
