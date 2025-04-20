import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// Type definition for sacrament data
interface SacramentData {
  type: string;
  date: string;
}

// Pobranie wszystkich parafian
export const GET = async () => {
  try {
    const parishioners = await prisma.parishioner.findMany({
      include: {
        address: true,
        sacraments: true
      }
    });
    return NextResponse.json(parishioners, { status: 200 });
  } catch (error) {
    console.error('Error fetching parishioners:', error);
    return NextResponse.json({ error: "Error fetching parishioners" }, { status: 500 });
  }
}

// Dodanie nowego parafianina
export const POST = async (req: Request) => {
  try {
    let firstName: string | null = null;
    let lastName: string | null = null;
    let dateOfBirth: string | null = null;
    let phoneNumber: string | null = null;
    let email: string | null = null;
    let notes: string | null = null;
    
    let street: string | null = null;
    let houseNumber: string | null = null;
    let postalCode: string | null = null;
    let city: string | null = null;
    
    let sacramentsData: SacramentData[] = [];
    
    // Check content type to determine how to parse the request
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON request
      const body = await req.json();
      
      firstName = body.firstName;
      lastName = body.lastName;
      dateOfBirth = body.dateOfBirth;
      phoneNumber = body.phoneNumber;
      email = body.email;
      notes = body.notes;
      
      // Address data
      if (body.address) {
        street = body.address.street;
        houseNumber = body.address.houseNumber;
        postalCode = body.address.postalCode;
        city = body.address.city;
      }
      
      // Sacraments data
      if (body.sacraments && Array.isArray(body.sacraments)) {
        sacramentsData = body.sacraments;
      }
    } else {
      // Try to handle as FormData request (default)
      try {
        const formData = await req.formData();
        
        firstName = formData.get('firstName') as string;
        lastName = formData.get('lastName') as string;
        dateOfBirth = formData.get('dateOfBirth') as string;
        phoneNumber = formData.get('phoneNumber') as string;
        email = formData.get('email') as string;
        notes = formData.get('notes') as string;
        
        // Address data
        street = formData.get('street') as string;
        houseNumber = formData.get('houseNumber') as string;
        postalCode = formData.get('postalCode') as string;
        city = formData.get('city') as string;
        
        // Sacraments data
        const sacramentsString = formData.get('sacraments');
        if (sacramentsString) {
          try {
            const parsed = JSON.parse(sacramentsString as string);
            if (Array.isArray(parsed)) {
              sacramentsData = parsed;
            }
          } catch (parseError) {
            console.error('Error parsing sacraments JSON:', parseError);
          }
        }
      } catch (formError) {
        console.error('Error parsing form data:', formError);
        return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
      }
    }
    
    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    console.log('Creating parishioner with address data:', { street, houseNumber, postalCode, city });
    
    // Użyj transakcji Prisma do utworzenia parafianina i jego danych
    const newParishioner = await prisma.$transaction(async (prismaTransaction) => {
      // Utwórz adres jeśli podano dane
      let addressId: string | undefined = undefined;
      if (street && houseNumber && postalCode && city) {
        console.log('Creating address with data:', { street, houseNumber, postalCode, city });
        const address = await prismaTransaction.address.create({
          data: {
            street,
            houseNumber,
            postalCode,
            city
          }
        });
        addressId = address.id;
        console.log('Address created with ID:', addressId);
      }
      
      // Utwórz parafianina
      const parishioner = await prismaTransaction.parishioner.create({
        data: {
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          addressId,
          phoneNumber: phoneNumber || undefined,
          email: email || undefined,
          notes: notes || undefined
        }
      });
      
      // Utwórz sakramenty jeśli podano
      if (sacramentsData.length > 0) {
        await Promise.all(sacramentsData.map((sacrament) => {
          return prismaTransaction.sacrament.create({
            data: {
              type: sacrament.type,
              date: new Date(sacrament.date),
              parishionerId: parishioner.id
            }
          });
        }));
      }
      
      // Pobierz utworzonego parafianina wraz z danymi
      return prismaTransaction.parishioner.findUnique({
        where: { id: parishioner.id },
        include: {
          address: true,
          sacraments: true
        }
      });
    });
    
    return NextResponse.json({ message: "Parishioner added successfully", parishioner: newParishioner }, { status: 201 });
  } catch (error) {
    console.error('Error adding parishioner:', error);
    return NextResponse.json({ error: "Error adding parishioner" }, { status: 500 });
  }
}
