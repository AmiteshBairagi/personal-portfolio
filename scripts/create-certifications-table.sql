-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    credential_id TEXT NOT NULL,
    image TEXT,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    verification_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    valid_until TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Professional', 'Associate', 'Expert')),
    exam_score TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certifications_featured ON certifications(featured);
CREATE INDEX IF NOT EXISTS idx_certifications_level ON certifications(level);
CREATE INDEX IF NOT EXISTS idx_certifications_display_order ON certifications(display_order);
CREATE INDEX IF NOT EXISTS idx_certifications_created_at ON certifications(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow public read access" ON certifications
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users full access" ON certifications
    FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_certifications_updated_at 
    BEFORE UPDATE ON certifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample certifications data (7+ certifications)
INSERT INTO certifications (
    id, title, issuer, date, credential_id, image, description, skills, 
    verification_url, featured, valid_until, level, exam_score, display_order
) VALUES 
(
    'cert-1',
    'AWS Certified Solutions Architect - Professional',
    'Amazon Web Services',
    'March 2024',
    'AWS-SAP-2024-001',
    '/placeholder.svg?height=400&width=600',
    'Validates advanced technical skills and experience in designing distributed applications and systems on the AWS platform. This certification demonstrates the ability to design and deploy dynamically scalable, highly available, fault-tolerant, and reliable applications on AWS.',
    ARRAY['AWS', 'Cloud Architecture', 'Security', 'Scalability', 'High Availability', 'Disaster Recovery'],
    'https://aws.amazon.com/verification/cert-1',
    true,
    '2027',
    'Professional',
    '892/1000',
    1
),
(
    'cert-2',
    'Google Cloud Professional Cloud Architect',
    'Google Cloud',
    'February 2024',
    'GCP-PCA-2024-002',
    '/placeholder.svg?height=400&width=600',
    'Demonstrates ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions to drive business objectives. This certification validates expertise in cloud architecture and Google Cloud technologies.',
    ARRAY['Google Cloud', 'Kubernetes', 'Microservices', 'DevOps', 'Container Orchestration'],
    'https://cloud.google.com/certification/verify/cert-2',
    true,
    '2026',
    'Professional',
    '87%',
    2
),
(
    'cert-3',
    'Microsoft Azure Solutions Architect Expert',
    'Microsoft',
    'January 2024',
    'AZ-305-2024-003',
    '/placeholder.svg?height=400&width=600',
    'Validates expertise in designing solutions that run on Azure, including aspects like compute, network, storage, and security. This certification demonstrates advanced skills in Azure architecture and implementation.',
    ARRAY['Azure', 'Cloud Solutions', 'Identity Management', 'Monitoring', 'Business Continuity'],
    'https://learn.microsoft.com/verify/cert-3',
    true,
    '2026',
    'Expert',
    '850/1000',
    3
),
(
    'cert-4',
    'Certified Kubernetes Administrator (CKA)',
    'Cloud Native Computing Foundation',
    'December 2023',
    'CKA-2023-004',
    '/placeholder.svg?height=400&width=600',
    'Demonstrates the ability to perform the responsibilities of Kubernetes administrators including installation, configuration, and management of production-grade Kubernetes clusters. This hands-on certification validates practical skills.',
    ARRAY['Kubernetes', 'Container Orchestration', 'Cluster Management', 'Troubleshooting', 'Security'],
    'https://training.linuxfoundation.org/verify/cert-4',
    false,
    '2026',
    'Professional',
    '89%',
    4
),
(
    'cert-5',
    'HashiCorp Certified: Terraform Associate',
    'HashiCorp',
    'November 2023',
    'HCP-TF-2023-005',
    '/placeholder.svg?height=400&width=600',
    'Validates foundational skills and knowledge in Infrastructure as Code (IaC) using Terraform. This certification demonstrates understanding of basic concepts and skills associated with open source HashiCorp Terraform.',
    ARRAY['Terraform', 'Infrastructure as Code', 'DevOps', 'Automation', 'Cloud Provisioning'],
    'https://www.credly.com/verify/cert-5',
    false,
    '2025',
    'Associate',
    '82%',
    5
),
(
    'cert-6',
    'Docker Certified Associate (DCA)',
    'Docker Inc.',
    'October 2023',
    'DCA-2023-006',
    '/placeholder.svg?height=400&width=600',
    'Validates skills in containerization using Docker technology. This certification demonstrates proficiency in Docker fundamentals, image creation, orchestration, storage and volumes, networking, and security.',
    ARRAY['Docker', 'Containerization', 'DevOps', 'Microservices', 'Container Security'],
    'https://credentials.docker.com/verify/cert-6',
    false,
    '2025',
    'Associate',
    '78%',
    6
),
(
    'cert-7',
    'Certified Information Systems Security Professional (CISSP)',
    'ISC2',
    'September 2023',
    'CISSP-2023-007',
    '/placeholder.svg?height=400&width=600',
    'Validates expertise in cybersecurity and information security. This certification demonstrates advanced knowledge in security and risk management, asset security, security architecture, communication and network security.',
    ARRAY['Cybersecurity', 'Risk Management', 'Security Architecture', 'Incident Response', 'Compliance'],
    'https://www.isc2.org/verify/cert-7',
    true,
    '2026',
    'Professional',
    '85%',
    7
),
(
    'cert-8',
    'MongoDB Certified Developer Associate',
    'MongoDB Inc.',
    'August 2023',
    'MDB-DEV-2023-008',
    '/placeholder.svg?height=400&width=600',
    'Demonstrates proficiency in developing applications with MongoDB. This certification validates skills in data modeling, indexing, aggregation framework, and MongoDB best practices for application development.',
    ARRAY['MongoDB', 'NoSQL', 'Database Design', 'Aggregation', 'Performance Optimization'],
    'https://university.mongodb.com/verify/cert-8',
    false,
    '2025',
    'Associate',
    '91%',
    8
),
(
    'cert-9',
    'Red Hat Certified System Administrator (RHCSA)',
    'Red Hat',
    'July 2023',
    'RHCSA-2023-009',
    '/placeholder.svg?height=400&width=600',
    'Validates skills in system administration tasks on Red Hat Enterprise Linux systems. This hands-on certification demonstrates ability to perform core system administration skills required in Red Hat Enterprise Linux environments.',
    ARRAY['Linux', 'System Administration', 'Red Hat', 'Command Line', 'Server Management'],
    'https://rhtapps.redhat.com/verify/cert-9',
    false,
    '2026',
    'Professional',
    '88%',
    9
);

-- Update display_order to ensure proper ordering
UPDATE certifications SET display_order = 
    CASE id
        WHEN 'cert-1' THEN 1
        WHEN 'cert-2' THEN 2
        WHEN 'cert-3' THEN 3
        WHEN 'cert-4' THEN 4
        WHEN 'cert-5' THEN 5
        WHEN 'cert-6' THEN 6
        WHEN 'cert-7' THEN 7
        WHEN 'cert-8' THEN 8
        WHEN 'cert-9' THEN 9
    END;
