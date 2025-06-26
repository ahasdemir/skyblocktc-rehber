# 🤝 Contributing Guide

Thank you for your interest in contributing to the SkyBlockTC Admin Panel project! This guide explains how you can contribute to the project.

## 📋 Table of Contents

- [Development Environment Setup](#-development-environment-setup)
- [Code Standards](#-code-standards)
- [Commit Rules](#-commit-rules)
- [Pull Request Process](#-pull-request-process)
- [Issue Reporting](#-issue-reporting)
- [Security Policy](#-security-policy)

## 🚀 Development Environment Setup

### Requirements
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- MongoDB (local or Atlas)
- Git

### Setup Steps

1. **Fork the project**
   ```bash
   # Click the fork button on GitHub
   ```

2. **Create local copy**
   ```bash
   git clone https://github.com/YOUR_USERNAME/minecraft-admin.git
   cd minecraft-admin
   ```

3. **Add upstream repository**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/minecraft-admin.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Fill .env.local file with your own values
   ```

6. **Initialize database**
   ```bash
   node scripts/seed.js
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Code Standards

### TypeScript
- All new code must be written in TypeScript
- Avoid using `any` type
- Define interfaces and types appropriately

```typescript
// ✅ Good
interface User {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'moderator' | 'helper';
}

// ❌ Bad
const user: any = {
  id: '123',
  username: 'test'
};
```

### React/Next.js
- Prefer functional components
- Use custom hooks appropriately
- Properly separate Server/Client components

```tsx
// ✅ Good
'use client';
import { useState, useEffect } from 'react';

interface Props {
  userId: string;
}

export default function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // User fetch logic
  }, [userId]);

  return <div>{user?.displayName}</div>;
}
```

### API Endpoints
- Use JWT authentication
- Implement proper error handling
- TypeScript type safety for request/response

```typescript
// ✅ Good
export async function POST(request: Request) {
  try {
    // JWT validation
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    // Business logic
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Styling
- Use Tailwind CSS
- Apply responsive design principles
- Maintain consistent color scheme

```tsx
// ✅ Good
<div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
  <h2 className="text-xl font-bold mb-2">Title</h2>
  <p className="text-gray-300">Description</p>
</div>
```

## 🔧 Commit Rules

### Commit Message Format
```
type(scope): brief description

Detailed description (optional)

Fixes #issue-number (optional)
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code refactoring
- `test`: Adding/editing tests
- `chore`: Build process, dependencies etc.

### Examples
```bash
feat(auth): add JWT token refresh system

fix(api): null reference error in user delete endpoint

docs(readme): update installation steps

style(components): format AuthGuard component with prettier
```

## 🔄 Pull Request Process

### Before Creating PR
1. **Get updates from upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push branch**
   ```bash
   git push origin feature/amazing-feature
   ```

### PR Template
```markdown
## 📝 Description
Brief description of changes made in this PR

## 🔧 Changes
- [ ] New feature added
- [ ] Bug fix implemented
- [ ] Documentation updated
- [ ] Tests added

## 🧪 Testing
- [ ] Local tests passed
- [ ] Manual testing done
- [ ] E2E tests passed

## 📋 Checklist
- [ ] Code review ready
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Responsive design checked
- [ ] Accessibility checked

## 📸 Screenshots (optional)
<!-- Add screenshots if there are UI changes -->

## 🔗 Related Issue
Fixes #123
```

### PR Review Process
1. **Automated Checks**: CI/CD pipeline must pass
2. **Code Review**: At least 1 maintainer approval
3. **Testing**: Changes must be tested
4. **Documentation**: Update documentation if needed

## 🐛 Issue Reporting

### Bug Report Template
```markdown
## 🐛 Bug Description
Brief and clear description of the bug

## 🔄 Steps to Reproduce
1. Go to page '...'
2. Click button '...'
3. See error

## 📱 Expected Behavior
Description of what should happen

## 📸 Screenshots
Add screenshots if available

## 🖥️ Environment Info
- OS: [Windows 10, macOS, Ubuntu]
- Browser: [Chrome, Firefox, Safari]
- Version: [Project version]
- Node.js: [Node.js version]

## 📋 Additional Information
Additional notes, suggestions etc.
```

### Feature Request Template
```markdown
## 🚀 Feature Request
Brief description of the new feature

## 🎯 Problem
What problem will this solve? Why is it needed?

## 💡 Proposed Solution
How can it be solved? Alternatives?

## 🔗 Related Resources
References, mockups, documents etc.
```

## 🔒 Security Policy

### Security Vulnerability Reporting
- **Do not open public issues** for security vulnerabilities
- Report security issues to security@skyblocktc.com
- Provide detailed information but don't share exploit details

### Security Checklist
- [ ] SQL Injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] JWT token security
- [ ] Input validation
- [ ] Error handling (no sensitive info leaks)

## 📋 Development Workflow

### Branch Strategy
```
main
├── develop
├── feature/user-management
├── feature/discord-integration
├── hotfix/login-bug
└── release/v1.2.0
```

### Versioning System
We use Semantic Versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- `1.0.0` → `1.0.1` (patch)
- `1.0.1` → `1.1.0` (minor)
- `1.1.0` → `2.0.0` (major)

### Release Process
1. **Create release branch from develop**
2. **Run final tests**
3. **Bump version**
4. **Update changelog**
5. **Merge to main branch**
6. **Create tag**
7. **Deploy**

## 🎯 Contribution Areas

### Priority Areas
- 🔐 **Security**: Authentication/authorization improvements
- 📊 **Performance**: Areas that can be optimized
- 🎨 **UI/UX**: User experience improvements
- 🧪 **Testing**: Increase test coverage
- 📝 **Documentation**: Documentation improvements

### Technical Debt
- Rate limiting implementation
- Refresh token system
- Email notification system
- Mobile responsive improvements
- API documentation (Swagger)

## 💡 Help and Support

### Communication Channels
- 💬 **Discord**: [SkyBlockTC Discord](https://discord.gg/skyblocktc)
- 📧 **Email**: dev@skyblocktc.com
- 🐛 **Issues**: GitHub Issues
- 📚 **Docs**: Project documentation

### Mentorship
For new contributors:
- Constructive feedback in code reviews
- Help with technical questions
- Teaching best practices
- Sharing open source culture

---

## 🙏 Thank You

Thank you for wanting to contribute to the SkyBlockTC Admin Panel project! Every contribution is valuable:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions
- 📣 Sharing the project

**Happy Coding!** 🚀
